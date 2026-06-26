/*
 * Copyright 2020 WebAssembly Community Group participants
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

self.importScripts('shared.js');

let api;
let port;
let canvas;
let ctx2d;

async function fetchWithProgress(filename) {
  const response = await fetch(filename);
  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  try {
    if (!response.body || !response.body.getReader) {
      throw new Error("ReadableStream not supported or null body");
    }
    
    let loaded = 0;
    const reader = response.body.getReader();
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (port) {
        port.postMessage({
          id: 'progress',
          data: { filename, loaded, total: total || loaded, done: false }
        });
      }
    }
    const all = new Uint8Array(loaded);
    let position = 0;
    for (const chunk of chunks) {
      all.set(chunk, position);
      position += chunk.length;
    }
    if (port) {
      port.postMessage({
        id: 'progress',
        data: { filename, loaded, total: total || loaded, done: true }
      });
    }
    return all.buffer;
  } catch (e) {
    console.warn("fetchWithProgress streaming failed, falling back to arrayBuffer:", e);
    const buffer = await response.arrayBuffer();
    if (port) {
      port.postMessage({
        id: 'progress',
        data: { filename, loaded: buffer.byteLength, total: buffer.byteLength, done: true }
      });
    }
    return buffer;
  }
}

const apiOptions = {
  async readBuffer(filename) {
    return fetchWithProgress(filename);
  },

  async compileStreaming(filename) {
    const buffer = await fetchWithProgress(filename);
    return WebAssembly.compile(buffer);
  },

  hostWrite(s) { port.postMessage({id : 'write', data : s}); }
};

let currentApp = null;

const onAnyMessage = async event => {
  switch (event.data.id) {
  case 'constructor':
    port = event.data.data;
    self.port = port;
    port.onmessage = onAnyMessage;
    api = new API(apiOptions);
    break;

  case 'initShared':
    self.sharedBuffer = event.data.data;
    self.sharedInt32 = new Int32Array(self.sharedBuffer);
    self.sharedUint8 = new Uint8Array(self.sharedBuffer);
    break;

  case 'setShowTiming':
    api.showTiming = event.data.data;
    break;

  case 'compileToAssembly': {
    const responseId = event.data.responseId;
    let output = null;
    let transferList;
    try {
      output = await api.compileToAssembly(event.data.data);
    } finally {
      port.postMessage({id : 'runAsync', responseId, data : output},
                       transferList);
    }
    break;
  }

  case 'compileTo6502': {
    const responseId = event.data.responseId;
    let output = null;
    let transferList;
    try {
      output = await api.compileTo6502(event.data.data);
    } finally {
      port.postMessage({id : 'runAsync', responseId, data : output},
                       transferList);
    }
    break;
  }

  case 'compileLinkRun':
    if (currentApp) {
      console.log('First, disallowing rAF from previous app.');
      // Stop running rAF on the previous app, if any.
      currentApp.allowRequestAnimationFrame = false;
    }
    try {
      api.memfs.setStdinStr(event.data.data.stdin || "");
      currentApp = await api.compileLinkRun(event.data.data.code);
      port.postMessage({id: 'write', data: 'finished compileLinkRun\n'});
    } catch (e) {
      console.error(e);
      port.postMessage({id: 'write', data: `Error: ${e.message || e}\n`});
    }
    break;

  case 'postCanvas':
    canvas = event.data.data;
    ctx2d = canvas.getContext('2d');
    break;
  }
};

self.onmessage = onAnyMessage;
