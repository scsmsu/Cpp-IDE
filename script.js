// Unregister legacy service workers to avoid caching issues
if (navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      for (let registration of registrations) {
        registration.unregister().then(() => {
          console.log("Legacy service worker unregistered.");
        });
      }
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  });
}

// Define standard C++ templates
const templates = {
  'hello-world': `#include <iostream>
using namespace std;
int main() {
    cout << "Hello, World!" << endl;
    cout << "다듬 IDE에 오신걸 환영합니다!" << endl;
    return 0;
}`,

  'input-output': `#include <iostream>
#include <string>

using namespace std;

int main() {
    int age;
    string name;

    // 출력 후 사용자가 입력할 수 있게 안내합니다.
    cout << "이름을 입력하세요: ";

    // getline은 "공백 포함 문자열" 입력에 적합합니다.
    // 예: "Kim Roi" 처럼 띄어쓰기가 있어도 전체를 읽습니다.
    getline(cin, name);

    cout << "나이를 입력하세요: ";
    cin >> age;  // 정수 1개 입력

    cout << "\\n--- 입력 결과 ---" << endl;
    cout << "안녕하세요, " << name << "님!" << endl;
    cout << "내년 나이는 " << (age + 1) << "살이 됩니다." << endl;

    return 0;
}`,

  'loops': `#include <iostream>

using namespace std;

int main() {
    // 1) for문: 1부터 5까지 출력
    // 구조: for (초기식; 조건식; 증감식)
    cout << "[for] 1부터 5까지: ";
    for (int i = 1; i <= 5; i++) {
        cout << i << " ";
    }
    cout << endl;

    // 2) while문: 합계 계산 예제
    int n = 1;
    int sum = 0;

    // n이 5 이하인 동안 반복
    while (n <= 5) {
        sum += n;  // sum = sum + n
        n++;       // n을 1 증가
    }

    cout << "[while] 1~5 합계: " << sum << endl;

    // 3) break / continue 간단 예시
    cout << "[for + continue] 짝수만 출력: ";
    for (int x = 1; x <= 10; x++) {
        if (x % 2 != 0) {
            continue;  // 홀수면 아래 코드를 건너뛰고 다음 반복으로
        }
        cout << x << " ";
    }
    cout << endl;

    return 0;
}`,

  'arrays-vector': `#include <iostream>
#include <vector>

using namespace std;

int main() {
    // 1) 고정 크기 배열
    int scores[5] = {90, 85, 100, 70, 95};

    cout << "배열 원소: ";
    for (int i = 0; i < 5; i++) {
        cout << scores[i] << " ";
    }
    cout << endl;

    // 배열 평균 계산
    int total = 0;
    for (int i = 0; i < 5; i++) {
        total += scores[i];
    }
    cout << "배열 평균: " << (total / 5.0) << endl;

    // 2) vector: 동적 배열
    vector<int> nums;

    // push_back으로 원소 추가
    nums.push_back(10);
    nums.push_back(20);
    nums.push_back(30);

    cout << "\\nvector 원소: ";
    for (int i = 0; i < static_cast<int>(nums.size()); i++) {
        cout << nums[i] << " ";
    }
    cout << endl;

    // range-based for (C++11+) 문법
    cout << "range-based for: ";
    for (int value : nums) {
        cout << value << " ";
    }
    cout << endl;

    return 0;
}`,

  'functions': `#include <iostream>

using namespace std;

// 함수 선언(프로토타입)
int add(int a, int b);
void printLine();

int main() {
    printLine();

    int x = 5;
    int y = 7;

    // add 함수 호출
    int result = add(x, y);

    cout << x << " + " << y << " = " << result << endl;

    printLine();
    return 0;
}

// 함수 정의
int add(int a, int b) {
    // 전달받은 두 수의 합을 반환
    return a + b;
}

void printLine() {
    cout << "----------------------" << endl;
}`,

  'bouncing-balls': `#include <canvas_main.h>
#include <vector>
#include <cmath>

struct Particle {
    double x, y;
    double vx, vy;
    double radius;
    uint32_t color;
};

const int WIDTH = 800;
const int HEIGHT = 600;
Canvas canvas{WIDTH, HEIGHT};
std::vector<Particle> particles;

void setup() {
    // Generate random particles
    for (int i = 0; i < 40; ++i) {
        double r = 8 + (rand() % 12);
        double x = r + (rand() % (int)(WIDTH - 2 * r));
        double y = r + (rand() % (int)(HEIGHT - 2 * r));
        double vx = -2.5 + (rand() % 5);
        double vy = -2.5 + (rand() % 5);
        if (vx == 0) vx = 1.5;
        if (vy == 0) vy = 1.5;
        
        uint8_t r_col = 120 + (rand() % 135);
        uint8_t g_col = 80 + (rand() % 135);
        uint8_t b_col = 220 + (rand() % 35);
        
        particles.push_back({x, y, vx, vy, r, RGB(r_col, g_col, b_col)});
    }
}

void loop(double timeSec, double elapsedSec) {
    // Draw fading background for trails
    canvas.setFillStyle("rgba(8, 12, 21, 0.3)");
    canvas.fillRect(0, 0, WIDTH, HEIGHT);
    
    for (auto& p : particles) {
        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
        
        // Wall collisions
        if (p.x - p.radius < 0) {
            p.x = p.radius;
            p.vx = -p.vx;
        }
        if (p.x + p.radius > WIDTH) {
            p.x = WIDTH - p.radius;
            p.vx = -p.vx;
        }
        if (p.y - p.radius < 0) {
            p.y = p.radius;
            p.vy = -p.vy;
        }
        if (p.y + p.radius > HEIGHT) {
            p.y = HEIGHT - p.radius;
            p.vy = -p.vy;
        }
        
        // Draw Particle Circle
        canvas.beginPath();
        canvas.arc(p.x, p.y, p.radius, 0, 2 * M_PI);
        canvas.setFillStyle(RGBA(p.color & 0xFF, (p.color >> 8) & 0xFF, (p.color >> 16) & 0xFF, 180));
        canvas.fill(FILL_RULE_NONZERO);
        
        // Draw soft glow outline
        canvas.beginPath();
        canvas.arc(p.x, p.y, p.radius + 3, 0, 2 * M_PI);
        canvas.setFillStyle(RGBA(p.color & 0xFF, (p.color >> 8) & 0xFF, (p.color >> 16) & 0xFF, 40));
        canvas.fill(FILL_RULE_NONZERO);
    }
    
    // Draw Info text overlays
    canvas.setFillStyle("#06b6d4");
    canvas.setFont("bold 18px Outfit");
    canvas.fillText("C++ Physics Sandbox", 25, 45);
    
    canvas.setFillStyle("#9ca3af");
    canvas.setFont("13px monospace");
    canvas.fillText("Frame Time: " + std::to_string(timeSec) + "s", 25, 75);
}`,

  'matrix-rain': `#include <canvas_main.h>
#include <vector>
#include <string>

const int WIDTH = 800;
const int HEIGHT = 600;
const int FONT_SIZE = 14;
const int COLUMNS = WIDTH / FONT_SIZE;
Canvas canvas{WIDTH, HEIGHT};

std::vector<int> drops;
std::string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%+*=";

void setup() {
    drops.resize(COLUMNS, 1);
}

void loop(double timeSec, double elapsedSec) {
    // Semi-transparent background for green trail fading
    canvas.setFillStyle("rgba(5, 7, 12, 0.08)");
    canvas.fillRect(0, 0, WIDTH, HEIGHT);
    
    canvas.setFont("13px monospace");
    
    for (size_t i = 0; i < drops.size(); ++i) {
        // Pick random character from standard list
        char text[2] = { chars[rand() % chars.length()], '\\0' };
        
        int x = i * FONT_SIZE;
        int y = drops[i] * FONT_SIZE;
        
        // Occasional bright leading characters
        if (rand() % 10 == 0) {
            canvas.setFillStyle("#ffffff");
            canvas.fillText(text, x, y);
        } else {
            canvas.setFillStyle("#10b981"); // Matrix green
            canvas.fillText(text, x, y);
        }
        
        // Increment drop or reset to top based on random threshold
        if (y > HEIGHT && rand() % 100 > 97) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}`,

  'fractal-tree': `#include <canvas_main.h>
#include <cmath>

const int WIDTH = 800;
const int HEIGHT = 600;
Canvas canvas{WIDTH, HEIGHT};
double angleOffset = 0.0;

void drawBranch(double x, double y, double length, double angle, int depth) {
    if (depth == 0) return;
    
    // Calculate ending coordinate
    double x2 = x + length * cos(angle);
    double y2 = y + length * sin(angle);
    
    // Linewidth scales down with depth
    canvas.setLineWidth(depth * 1.2);
    
    // Shifting color scheme based on recursion level
    if (depth > 4) {
        canvas.setStrokeStyle("#8b5cf6"); // Purple branches
    } else {
        canvas.setStrokeStyle("#06b6d4"); // Cyan leaves
    }
    
    // Draw path
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(x2, y2);
    canvas.stroke();
    
    // Recursive branch split (scaling factor modulates slightly over time)
    double scale = 0.72 + 0.04 * sin(angleOffset);
    drawBranch(x2, y2, length * scale, angle - 0.45 + 0.08 * sin(angleOffset), depth - 1);
    drawBranch(x2, y2, length * scale, angle + 0.45 - 0.08 * cos(angleOffset), depth - 1);
}

void setup() {
    canvas.setLineCap(LINE_CAP_ROUND);
}

void loop(double timeSec, double elapsedSec) {
    canvas.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Background draw
    canvas.setFillStyle("#080c16");
    canvas.fillRect(0, 0, WIDTH, HEIGHT);
    
    // Animate angle oscillations
    angleOffset += elapsedSec * 0.45;
    
    // Start drawing tree from center bottom
    drawBranch(WIDTH / 2, HEIGHT - 15, 120, -M_PI_2, 9);
    
    // Info display
    canvas.setFillStyle("#ffffff");
    canvas.setFont("bold 16px Outfit");
    canvas.fillText("Recursive Fractal Tree", 25, 45);
    
    canvas.setFillStyle("#9ca3af");
    canvas.setFont("13px Outfit");
    canvas.fillText("Branches: 1023 | Animating in real-time", 25, 75);
}`
};

// canvas.h header mockup for read-only view
const canvasHContent = `#ifndef CANVAS_H_
#define CANVAS_H_

#include <stdint.h>
#include <string_view>

typedef double f64;
typedef uint32_t Handle;

enum FillRule { FILL_RULE_NONZERO, FILL_RULE_EVENODD };
enum LineCap { LINE_CAP_BUTT, LINE_CAP_ROUND, LINE_CAP_SQUARE };
enum LineJoin { LINE_JOIN_BEVEL, LINE_JOIN_ROUND, LINE_JOIN_MITER };
enum TextAlign { TEXT_ALIGN_LEFT, TEXT_ALIGN_RIGHT, TEXT_ALIGN_CENTER, TEXT_ALIGN_START, TEXT_ALIGN_END };
enum TextBaseline { TEXT_BASELINE_TOP, TEXT_BASELINE_HANGING, TEXT_BASELINE_MIDDLE, TEXT_BASELINE_ALPHABETIC, TEXT_BASELINE_IDEOGRAPHIC, TEXT_BASELINE_BOTTOM };

extern "C" {
    void canvas_requestAnimationFrame();
    void canvas_destroyHandle(Handle);
    void canvas_setWidth(int);
    void canvas_setHeight(int);
    void canvas_arc(f64 x, f64 y, f64 radius, f64 start_angle, f64 end_angle, bool anticlockwise);
    void canvas_clearRect(f64 x, f64 y, f64 w, f64 h);
    void canvas_fillRect(f64 x, f64 y, f64 w, f64 h);
    void canvas_fillText(const char *buf, size_t len, f64 x, f64 y);
    void canvas_lineTo(f64 x, f64 y);
    void canvas_moveTo(f64 x, f64 y);
    void canvas_stroke();
    void canvas_fill(enum FillRule);
    void canvas_setFillStyle(const char *buf, size_t);
    void canvas_setStrokeStyle(const char *buf, size_t);
    void canvas_setLineWidth(f64);
    void canvas_setFont(const char *buf, size_t);
}

class Canvas {
public:
    Canvas(int w, int h);
    void clearRect(f64 x, f64 y, f64 w, f64 h);
    void fillRect(f64 x, f64 y, f64 w, f64 h);
    void beginPath();
    void arc(f64 x, f64 y, f64 r, f64 start, f64 end, bool anti = false);
    void fill(enum FillRule rule = FILL_RULE_NONZERO);
    void stroke();
    void moveTo(f64 x, f64 y);
    void lineTo(f64 x, f64 y);
    void setFillStyle(std::string_view style);
    void setStrokeStyle(std::string_view style);
    void setLineWidth(f64 width);
    void setFont(std::string_view font);
    void fillText(std::string_view text, f64 x, f64 y);
};

#endif`;

// canvas_main.h mockup for read-only view
const canvasMainHContent = `#ifndef CANVAS_MAIN_H_
#define CANVAS_MAIN_H_

#include <canvas.h>

void setup();
void loop(double timeSec, double elapsedSec);

int main() {
    setup();
    canvas_requestAnimationFrame();
    return 0xC0C0A; // RAF code
}

#endif`;

// Known sizes for asset progress tracking
const fileSizes = {
  'memfs': 345442,
  'sysroot.tar': 9297920,
  'clang': 31214472,
  'lld': 19490094
};

let loadedBytes = {
  'memfs': 0,
  'sysroot.tar': 0,
  'clang': 0,
  'lld': 0
};

let clangDownloadNotified = false;
let lldDownloadNotified = false;

// Worker API Interface
class WorkerAPI {
  constructor(onWrite, onProgress) {
    this.nextResponseId = 0;
    this.responseCBs = new Map();
    this.worker = new Worker('worker.js');
    this.onWrite = onWrite;
    this.onProgress = onProgress;
    
    const channel = new MessageChannel();
    this.port = channel.port1;
    this.port.onmessage = this.onmessage.bind(this);

    const remotePort = channel.port2;
    this.worker.postMessage({id: 'constructor', data: remotePort},
                            [remotePort]);

    if (typeof SharedArrayBuffer !== "undefined") {
      this.sharedBuffer = new SharedArrayBuffer(65536);
      this.port.postMessage({id: 'initShared', data: this.sharedBuffer});
    } else {
      console.warn("SharedArrayBuffer is not supported in this environment.");
    }
  }

  setShowTiming(value) {
    this.port.postMessage({id: 'setShowTiming', data: value});
  }

  terminate() {
    this.worker.terminate();
  }

  compileLinkRun(code, stdin) {
    this.port.postMessage({id: 'compileLinkRun', data: {code, stdin}});
  }

  postCanvas(offscreenCanvas) {
    this.port.postMessage({id : 'postCanvas', data : offscreenCanvas},
                          [ offscreenCanvas ]);
  }

  onmessage(event) {
    const { id, data, responseId } = event.data;
    switch (id) {
      case 'write':
        this.onWrite(data);
        break;
      case 'progress':
        this.onProgress(data);
        break;
      case 'waitingForStdin':
        isWaitingForInput = true;
        break;
      case 'runAsync': {
        const promise = this.responseCBs.get(responseId);
        if (promise) {
          this.responseCBs.delete(responseId);
          promise.resolve(data);
        }
        break;
      }
    }
  }
}

// Global components state
let editor;
let term;
let api;
let isCompiling = false;
let currentFile = "main.cpp";
let mainCppCode = templates['hello-world'];
let themePreference = "system";
let systemThemeMedia = null;
let isDirty = false;
let isProgrammaticChange = false;
let compileLogs = "";
let isBufferingCompileLogs = false;
let isWaitingForInput = false;
let inputLineBuffer = "";
let loadingTimeout;

const THEME_STORAGE_KEY = "dadeum-theme-preference-v2";

let completedFiles = {
  'memfs': false,
  'sysroot.tar': false,
  'clang': false,
  'lld': false
};

// Progress bar updates
function handleProgress(progress) {
  const { filename, loaded, total, done } = progress;
  const name = filename.split('/').pop();
  
  if (fileSizes[name] !== undefined) {
    loadedBytes[name] = loaded;
  }
  
  if (done && completedFiles[name] !== undefined) {
    completedFiles[name] = true;
  }

  const initialTotal = fileSizes['memfs'] + fileSizes['sysroot.tar'];
  const initialLoaded = Math.min(initialTotal, loadedBytes['memfs'] + loadedBytes['sysroot.tar']);
  const initialPercent = Math.round((initialLoaded / initialTotal) * 100);

  const progressEl = document.getElementById('loading-progress');
  const statusEl = document.getElementById('loading-status');
  if (progressEl) progressEl.style.width = initialPercent + '%';
  if (statusEl) statusEl.textContent = `표준 라이브러리 및 헤더 파일 로딩 중 (${initialPercent}%)...`;

  // Use completedFiles done triggers to safely hide the loading screen
  if (completedFiles['memfs'] && completedFiles['sysroot.tar']) {
    if (typeof loadingTimeout !== 'undefined') {
      clearTimeout(loadingTimeout);
    }
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      if (overlay && overlay.style.display !== 'none') {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 400);
      }
    }, 400);
  }

  // Terminal compiler fetch notifications
  if (name === 'clang' && loaded > 0 && !clangDownloadNotified) {
    clangDownloadNotified = true;
    term.write('\r\n\x1b[96m[1/2] Clang 컴파일러 바이너리 다운로드 중 (~31MB)...\x1b[0m\r\n');
  }
  if (name === 'lld' && loaded > 0 && !lldDownloadNotified) {
    lldDownloadNotified = true;
    term.write('\r\n\x1b[96m[2/2] LLD 링커 바이너리 다운로드 중 (~19.5MB)...\x1b[0m\r\n');
  }

  const compileTotal = fileSizes['clang'] + fileSizes['lld'];
  const compileLoaded = Math.min(compileTotal, loadedBytes['clang'] + loadedBytes['lld']);
  const compilePercent = Math.round((compileLoaded / compileTotal) * 100);

  if (compilePercent > 0 && compilePercent < 100) {
    updateStatus(`컴파일러 툴체인 다운로드 중... (${compilePercent}%)`, 'warning');
  }
}

// Modify Dadeum status output block
function updateStatus(text, type = 'normal') {
  const statusBox = document.getElementById('status-output');
  if (!statusBox) return;

  statusBox.textContent = text;
  statusBox.className = '';
  
  if (type === 'success') {
    statusBox.classList.add('success');
  } else if (type === 'error') {
    statusBox.classList.add('error');
  }
}

// Sync compiler state
function setRunningState(running) {
  isCompiling = running;
  const runBtn = $('.run-btn');
  if (running) {
    runBtn.addClass('running');
    runBtn.html('<i class="fa-solid fa-circle-notch spin-icon"></i> 컴파일 중...');
    updateStatus('C++ 코드를 가상 샌드박스에서 컴파일 및 링크하고 있습니다...', 'normal');
  } else {
    runBtn.removeClass('running');
    runBtn.html('<i class="fa-solid fa-play"></i> 실행');
  }
}

// Initialize worker
function initWorker() {
  if (api) {
    api.terminate();
  }

  // Re-create canvas element for control transfer
  const oldCanvas = document.getElementById('offscreen-canvas');
  if (oldCanvas) {
    const parent = oldCanvas.parentElement;
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'offscreen-canvas';
    newCanvas.width = 800;
    newCanvas.height = 600;
    parent.replaceChild(newCanvas, oldCanvas);
  }

  try {
    api = new WorkerAPI(
      // onWrite
      (text) => {
        if (isBufferingCompileLogs) {
          compileLogs += text;
          
          if (compileLogs.includes('---START_PROGRAM_OUTPUT---')) {
            isBufferingCompileLogs = false;
            term.clear();
            const parts = compileLogs.split('---START_PROGRAM_OUTPUT---');
            let remainingText = parts.slice(1).join('---START_PROGRAM_OUTPUT---');
            remainingText = remainingText.replace(/^[\r\n]+/, '');
            if (remainingText) {
              term.write(remainingText);
            }
          } else if (text.includes('Error:') || text.includes('process exited')) {
            isBufferingCompileLogs = false;
            term.write(compileLogs);
          }
        } else {
          term.write(text);
        }
        
        if (text.includes('Error:') || text.includes('process exited') || text.includes('finished compileLinkRun')) {
          setRunningState(false);
        }
        
        if (text.includes('Error:')) {
          updateStatus('컴파일 실패: 문법 또는 링크 오류가 검출되었습니다. 터미널 콘솔 로그를 점검하세요.', 'error');
        } else if (text.includes('process exited with code 0')) {
          updateStatus('실행 완료: 프로그램 프로세스가 코드 0으로 성공적으로 실행 종료되었습니다.', 'success');
        } else if (text.includes('finished compileLinkRun')) {
          updateStatus('컴파일 완료: 코드가 컴파일되었으며, 가상 머신에서 구동 중입니다.', 'success');
        }
      },
      // onProgress
      (progress) => {
        handleProgress(progress);
      }
    );
  } catch (err) {
    console.error("Failed to initialize WorkerAPI:", err);
    if (typeof loadingTimeout !== 'undefined') {
      clearTimeout(loadingTimeout);
    }
    $('#loading-error-box').fadeIn();
    $('#loading-error-message').html(
      '웹 워커(Web Worker) 초기화에 실패했습니다.<br>' +
      '<span style="font-size: 11px; color: #fca5a5;">' + err.message + '</span><br><br>' +
      '로컬 파일(file://)로 직접 여신 경우 브라우저 보안 정책에 의해 가동이 차단됩니다. ' +
      'VS Code의 Live Server나 로컬 HTTP 개발 서버(또는 GitHub Pages)를 통해 열어 주세요.'
    );
    const statusEl = document.getElementById('loading-status');
    if (statusEl) {
      statusEl.textContent = '웹 워커 로딩 오류 발생';
    }
    return;
  }

  // Transfer control
  const canvasEl = document.getElementById('offscreen-canvas');
  if (canvasEl && canvasEl.transferControlToOffscreen) {
    try {
      const offscreen = canvasEl.transferControlToOffscreen();
      api.postCanvas(offscreen);
    } catch (e) {
      console.warn("Canvas transferControlToOffscreen bypass:", e);
    }
  }

  api.setShowTiming(true);
}

// Compile & Execute code
function runCode() {
  if (isCompiling) return;

  // Force workspace to main.cpp before compiling
  if (currentFile !== "main.cpp") {
    $('.tab-btn[data-file="main.cpp"]').click();
  }

  term.clear();
  setRunningState(true);

  compileLogs = "";
  isBufferingCompileLogs = true;

  const code = mainCppCode;
  
  // Reset Stdin buffer state before execution
  if (api && api.sharedBuffer) {
    const sharedInt32 = new Int32Array(api.sharedBuffer);
    sharedInt32[0] = 0; // STATUS_RUNNING
    sharedInt32[1] = 0; // input length
    sharedInt32[2] = 0; // read pointer
  }
  isWaitingForInput = false;
  inputLineBuffer = "";

  // Decide tab switch
  if (code.includes('canvas_main.h') || code.includes('loop(')) {
    $('.tab-btn[data-tab="tab-canvas"]').click();
  } else {
    $('.tab-btn[data-tab="tab-terminal"]').click();
  }

  api.compileLinkRun(code, "");
}

// Project Renamer
function setupProjectRenamer() {
  const displayBtn = document.getElementById('project-name-display');
  const inputEl = document.getElementById('project-name-input');
  
  if (!displayBtn || !inputEl) return;

  displayBtn.addEventListener('click', () => {
    displayBtn.hidden = true;
    inputEl.hidden = false;
    let val = displayBtn.textContent;
    if (val.endsWith('.cpp')) {
      val = val.slice(0, -4);
    }
    inputEl.value = val;
    inputEl.focus();
    inputEl.select();
  });

  const saveName = () => {
    const newName = inputEl.value.trim();
    if (newName) {
      syncProjectName(newName);
    }
    inputEl.hidden = true;
    displayBtn.hidden = false;
  };

  inputEl.addEventListener('blur', saveName);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      saveName();
    }
  });
}

function syncProjectName(name) {
  let cleanName = name.trim();
  if (cleanName.endsWith('.cpp')) {
    cleanName = cleanName.slice(0, -4);
  }
  if (!cleanName) return;

  const displayBtn = document.getElementById('project-name-display');
  const fileLabel = document.getElementById('file-name-label');
  
  if (displayBtn) {
    displayBtn.textContent = cleanName + '.cpp';
  }
  if (fileLabel) {
    fileLabel.textContent = cleanName + '.cpp';
  }
}

// Theme handling
function initializeTheme() {
  const saved = String(localStorage.getItem(THEME_STORAGE_KEY) || "").trim();
  if (saved === "light" || saved === "dark") {
    themePreference = saved;
  } else {
    themePreference = "system";
  }

  systemThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    if (themePreference === "system") applyTheme("system");
  };

  if (typeof systemThemeMedia.addEventListener === "function") {
    systemThemeMedia.addEventListener("change", onSystemThemeChange);
  } else if (typeof systemThemeMedia.addListener === "function") {
    systemThemeMedia.addListener(onSystemThemeChange);
  }

  applyTheme(themePreference);
}

function getResolvedTheme(preference = themePreference) {
  if (preference === "dark" || preference === "light") return preference;
  if (systemThemeMedia?.matches) return "dark";
  return "light";
}

function applyTheme(preference = themePreference) {
  const resolved = getResolvedTheme(preference);
  document.documentElement.dataset.theme = resolved;
  
  // Update dropdown checkmarks UI if menus exist
  syncThemeMenuButtons(resolved);
  
  // Sync Ace Editor theme
  if (editor) {
    if (resolved === "dark") {
      editor.setTheme('ace/theme/tomorrow_night_blue');
    } else {
      editor.setTheme('ace/theme/tomorrow');
    }
  }
}

function syncThemeMenuButtons(resolvedTheme) {
  // Toggle checked mark inside View menu dropdown items if matching
  $('[data-menu-action^="view-theme-"]').each(function() {
    const action = $(this).data('menu-action');
    const type = action.replace('view-theme-', '');
    if (type === themePreference) {
      $(this).css('border-left', '3px solid var(--accent-2)');
    } else {
      $(this).css('border-left', 'none');
    }
  });
}

function setThemePreference(nextPreference) {
  themePreference = nextPreference;
  if (nextPreference === "system") {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, nextPreference);
  }
  applyTheme(nextPreference);
}

// File actions
function downloadSource() {
  const code = mainCppCode;
  const blob = new Blob([code], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  let filename = document.getElementById('project-name-display').textContent;
  if (!filename.endsWith('.cpp')) {
    filename += '.cpp';
  }
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  isDirty = false;
  updateStatus('C++ 소스코드가 성공적으로 다운로드되었습니다.', 'success');
}

function copySourceToClipboard() {
  const code = mainCppCode;
  navigator.clipboard.writeText(code).then(() => {
    updateStatus('C++ 소스코드가 클립보드에 복사되었습니다.', 'success');
    setTimeout(() => updateStatus('준비 완료'), 3000);
  }).catch(err => {
    console.error('클립보드 복사 실패:', err);
  });
}

// On Ready Load
$(document).ready(() => {
  // Configure Ace
  ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/');
  editor = ace.edit('editor');
  
  editor.session.setMode('ace/mode/c_cpp');
  editor.setOptions({
    fontFamily: "JetBrains Mono, Monaco, Menlo, 'Ubuntu Mono', Consolas, monospace",
    fontSize: '14px',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    tabSize: 4,
    useSoftTabs: true
  });

  // Force editor to re-measure character size once fonts are loaded to fix cursor alignment
  if (document.fonts) {
    document.fonts.ready.then(() => {
      if (editor) {
        editor.renderer.updateCharacterSize();
        editor.resize();
      }
    });
  }

  // Track main.cpp buffer
  isProgrammaticChange = true;
  editor.setValue(mainCppCode);
  editor.clearSelection();
  isProgrammaticChange = false;
  isDirty = false;
  
  editor.on('change', () => {
    if (currentFile === "main.cpp") {
      mainCppCode = editor.getValue();
      if (!isProgrammaticChange) {
        isDirty = true;
      }
    }
  });

  // Theme Sync
  initializeTheme();

  // Set up Xterm.js
  try {
    if (typeof Terminal !== "undefined") {
      if (typeof fit !== "undefined") {
        Terminal.applyAddon(fit);
      } else {
        console.warn("xterm fit addon is not defined in global scope");
      }
      term = new Terminal({
        convertEol: true,
        fontSize: 14,
        fontFamily: 'JetBrains Mono, Courier New, monospace',
        cursorBlink: true,
        theme: {
          background: '#07090e',
          foreground: '#f3f4f6',
          cursor: '#8b5cf6',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#8b5cf6',
          cyan: '#06b6d4'
        }
      });
      term.open(document.getElementById('terminal'));
      if (typeof term.fit === "function") {
        term.fit();
      }
      
      term.write('\x1b[95mDadeum C++ Compiler Sandbox 가동\x1b[0m\r\n');
      term.write('상단 메뉴에서 실행 단축키 또는 저장 기능들을 이용하십시오.\r\n\r\n');

      if (typeof SharedArrayBuffer === "undefined") {
        term.write('\x1b[91m[오류] 브라우저가 SharedArrayBuffer를 지원하지 않거나 Cross-Origin Isolation(COOP/COEP)이 비활성화되었습니다.\r\n');
        term.write('실시간 입력(cin/scanf) 기능이 동작하지 않습니다. localhost 환경 또는 dev server 설정을 확인하세요.\x1b[0m\r\n\r\n');
      }

      term.on('data', (data) => {
        if (isWaitingForInput) {
          for (let i = 0; i < data.length; i++) {
            const char = data[i];
            if (char === '\r' || char === '\n') {
              term.write('\r\n');
              sendInputToWorker(inputLineBuffer + '\n');
              inputLineBuffer = "";
              isWaitingForInput = false;
              break;
            } else if (char === '\x7f' || char === '\b') {
              if (inputLineBuffer.length > 0) {
                const lastChar = inputLineBuffer[inputLineBuffer.length - 1];
                const width = getCharWidth(lastChar);
                inputLineBuffer = inputLineBuffer.slice(0, -1);
                if (width === 2) {
                  term.write('\b\b  \b\b');
                } else {
                  term.write('\b \b');
                }
              }
            } else {
              inputLineBuffer += char;
              term.write(char);
            }
          }
        }
      });
    }
  } catch(e) {
    console.error("xterm terminal initialization failed:", e);
  }

  // Set safety timeout for loading screen (10 seconds)
  loadingTimeout = setTimeout(() => {
    $('#loading-error-box').fadeIn();
    const statusEl = document.getElementById('loading-status');
    if (statusEl) {
      statusEl.textContent = '로딩 지연 중: 네트워크 혹은 서비스 워커 준비를 대기하고 있습니다.';
    }
  }, 10000);

  // Force close loading overlay handler
  $('#btn-force-close-loading').on('click', () => {
    if (loadingTimeout) {
      clearTimeout(loadingTimeout);
    }
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 400);
    }
  });

  // Load compiler worker
  initWorker();

  // Rename Setup
  setupProjectRenamer();
  syncProjectName('DadeumCppProject');

  // Dropdown Menus event listeners
  $('.menu-trigger').on('click', function(e) {
    e.stopPropagation();
    const parent = $(this).closest('.menu-root');
    const isOpen = parent.hasClass('is-open');
    
    // Close other dropdowns
    $('.menu-root').removeClass('is-open');
    
    if (!isOpen) {
      parent.addClass('is-open');
    }
  });

  $(document).on('click', () => {
    $('.menu-root').removeClass('is-open');
  });

  // Helper function to load template by key
  function loadTemplateByKey(templateKey, displayName) {
    if (templates[templateKey]) {
      if (isDirty) {
        if (!confirm(`작성 중인 코드가 저장되지 않았습니다.\n새로운 예제 '${displayName}'을(를) 불러오시면 기존 코드는 사라집니다. 계속하시겠습니까?`)) {
          return;
        }
      }
      mainCppCode = templates[templateKey];
      if (currentFile === "main.cpp") {
        isProgrammaticChange = true;
        editor.setValue(mainCppCode);
        editor.clearSelection();
        isProgrammaticChange = false;
      }
      isDirty = false;
      updateStatus(`템플릿 '${displayName}' 코드가 워크스페이스에 로드되었습니다.`, 'success');
    }
  }

  // Menu action triggers
  $('.menu-action').on('click', function() {
    const action = $(this).data('menu-action');
    switch (action) {
      case 'file-new':
        const warnMsg = isDirty 
          ? '작성 중인 코드가 저장되지 않았습니다.\n새 파일을 작성하시면 기존 코드는 사라집니다. 계속하시겠습니까?'
          : '새 파일을 작성하시겠습니까? 현재 작성 중인 코드가 초기화됩니다.';
        if (confirm(warnMsg)) {
          mainCppCode = "";
          if (currentFile === 'main.cpp') {
            isProgrammaticChange = true;
            editor.setValue(mainCppCode);
            editor.clearSelection();
            isProgrammaticChange = false;
          }
          isDirty = false;
          updateStatus('새 C++ 문서 작업 시작', 'success');
        }
        break;
      case 'file-import-cpp':
        $('#file-input').click();
        break;
      case 'file-save-cpp':
        downloadSource();
        break;
      case 'file-save-wasm':
        updateStatus('Wasm 다운로드를 처리합니다...', 'normal');
        // Simple buffer download of test.wasm could be implemented or alert user
        alert('컴파일 성공 후에 test.wasm 파일로 로컬 다운로드합니다.');
        break;
      case 'edit-undo':
        editor.undo();
        break;
      case 'edit-redo':
        editor.redo();
        break;
      case 'edit-cut':
        // Standard copy/paste handles inside editor automatically
        break;
      case 'edit-copy':
        break;
      case 'edit-paste':
        break;

      case 'view-theme-light':
        setThemePreference('light');
        break;
      case 'view-theme-dark':
        setThemePreference('dark');
        break;
      case 'view-theme-system':
        setThemePreference('system');
        break;
      case 'temp-hello':
        loadTemplateByKey('hello-world', 'Hello World');
        break;
      case 'temp-input-output':
        loadTemplateByKey('input-output', '입출력');
        break;
      case 'temp-loops':
        loadTemplateByKey('loops', '반복문');
        break;
      case 'temp-arrays-vector':
        loadTemplateByKey('arrays-vector', '배열과 벡터');
        break;
      case 'temp-functions':
        loadTemplateByKey('functions', '함수');
        break;
      case 'temp-bouncing':
        loadTemplateByKey('bouncing-balls', '통통 튀는 파티클');
        break;
      case 'temp-matrix':
        loadTemplateByKey('matrix-rain', '매트릭스 디지털 비');
        break;
      case 'temp-fractal':
        loadTemplateByKey('fractal-tree', '재귀 프랙탈 나무');
        break;
      case 'run-code':
        runCode();
        break;
      case 'run-reset':
        if (confirm('컴파일 툴체인과 백그라운드 Worker 환경을 완전히 초기화합니까?')) {
          initWorker();
          term.clear();
          term.write('\x1b[93m컴파일러 샌드박스가 성공적으로 재설정되었습니다.\x1b[0m\r\n');
          updateStatus('샌드박스 재설정 완료', 'success');
        }
        break;
      case 'help-quick':
        $('.tab-btn[data-tab="tab-info"]').click();
        break;
      case 'help-about':
        alert('Dadeum IDE v1.0.0\nWebAssembly를 이용한 서버리스 웹 C++ 컴파일러 & IDE 개발 도구');
        break;
    }
  });

  // Action Bar Buttons
  $('#save-btn').on('click', () => downloadSource());
  $('#load-btn').on('click', () => $('#file-input').click());
  $('#copy-btn').on('click', () => runCode());

  // Workspace Files Tabs click switcher
  $('.workspace-panel .tab-btn').on('click', function() {
    $('.workspace-panel .tab-btn').removeClass('is-active');
    $(this).addClass('is-active');
    
    const filename = $(this).data('file');
    currentFile = filename;
    
    if (filename === "main.cpp") {
      editor.setValue(mainCppCode);
      editor.setReadOnly(false);
      editor.clearSelection();
      document.getElementById('file-name-label').textContent = "main.cpp";
    } else if (filename === "canvas.h") {
      editor.setValue(canvasHContent);
      editor.setReadOnly(true);
      editor.clearSelection();
      document.getElementById('file-name-label').textContent = "canvas.h (Read-Only)";
    } else if (filename === "canvas_main.h") {
      editor.setValue(canvasMainHContent);
      editor.setReadOnly(true);
      editor.clearSelection();
      document.getElementById('file-name-label').textContent = "canvas_main.h (Read-Only)";
    }
  });

  // Output view Tabs click switcher
  $('.output-tabs .tab-btn').on('click', function() {
    const targetTab = $(this).data('tab');
    
    $('.output-tabs .tab-btn').removeClass('is-active');
    $(this).addClass('is-active');
    
    $('.tab-content').removeClass('is-active');
    $('#' + targetTab).addClass('is-active');
    
    if (targetTab === 'tab-terminal' && term && typeof term.fit === 'function') {
      setTimeout(() => {
        try {
          term.fit();
        } catch(e) {
          console.warn("term.fit() failed:", e);
        }
      }, 20);
    }
  });

  // Stdin trigger file importer
  $('#file-input').on('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (isDirty) {
      if (!confirm('작성 중인 코드가 저장되지 않았습니다.\n새로운 파일을 불러오시면 기존 코드는 사라집니다. 계속하시겠습니까?')) {
        e.target.value = null; // reset input
        return;
      }
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      mainCppCode = event.target.result;
      if (currentFile === 'main.cpp') {
        isProgrammaticChange = true;
        editor.setValue(mainCppCode);
        editor.clearSelection();
        isProgrammaticChange = false;
      }
      isDirty = false;
      
      // Update renamer name
      const simpleName = file.name.replace(/\.[^/.]+$/, "");
      syncProjectName(simpleName);
      updateStatus(`C++ 파일 '${file.name}'을 성공적으로 불러왔습니다.`, 'success');
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  });

  // Fullscreen canvas
  $('#btn-canvas-fullscreen').on('click', () => {
    const canvas = document.getElementById('offscreen-canvas');
    if (!canvas) return;
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  });

  // Restart canvas triggers run
  $('#btn-canvas-refresh').on('click', () => runCode());

  // Command + Enter shortcuts
  editor.commands.addCommand({
    name: 'run',
    bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
    exec: runCode
  });

  // Resize window fitting
  window.addEventListener('resize', () => {
    if (term && typeof term.fit === 'function') {
      try {
        term.fit();
      } catch(e) {
        console.warn("term.fit() resize failed:", e);
      }
    }
  });

  // Warn before closing window if unsaved changes exist
  window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });
});

function getCharWidth(char) {
  const code = char.charCodeAt(0);
  if (
    (code >= 0x1100 && code <= 0x11ff) || // Hangul Jamo
    (code >= 0x2e80 && code <= 0x9fff) || // CJK Radicals, Symbols, Han
    (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
    (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
    (code >= 0xff00 && code <= 0xffef)    // Fullwidth Forms
  ) {
    return 2;
  }
  return 1;
}

function sendInputToWorker(str) {
  if (!api || !api.sharedBuffer) return;
  const encoder = new TextEncoder();
  const encoded = encoder.encode(str);
  
  const sharedUint8 = new Uint8Array(api.sharedBuffer);
  const sharedInt32 = new Int32Array(api.sharedBuffer);
  
  const maxLength = 65536 - 128;
  const lenToWrite = Math.min(encoded.length, maxLength);
  
  for (let i = 0; i < lenToWrite; i++) {
    sharedUint8[128 + i] = encoded[i];
  }
  
  sharedInt32[1] = lenToWrite;
  sharedInt32[2] = 0;
  
  Atomics.store(sharedInt32, 0, 2); // STATUS_READY = 2
  Atomics.notify(sharedInt32, 0, 1);
}
