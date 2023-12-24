class Rectangle {
    constructor(x1, y1, x2, y2) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }
  }

  class BruteForce {
    constructor() {
      this.rectangles = [];
    }

    addRectangle(rectangle) {
      this.rectangles.push(rectangle);
    }

    findOverlappingRectangles() {
      const overlappingRectangles = [];
      const n = this.rectangles.length;

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          if (this.doRectanglesOverlap(this.rectangles[i], this.rectangles[j])) {
            overlappingRectangles.push([i, j]);
          }
        }
      }

      return overlappingRectangles;
    }

    doRectanglesOverlap(rect1, rect2) {
        return (
            rect1.x2 > rect2.x1 &&
            rect1.x1 < rect2.x2 &&
            rect1.y2 > rect2.y1 &&
            rect1.y1 < rect2.y2
        );
    }
  }

  class SweepLine {
  constructor() {
    this.rectangles = [];
  }

  addRectangle(rectangle) {
    this.rectangles.push(rectangle);
  }

  findOverlappingRectangles() {
    const originalRectangles = [...this.rectangles];

    this.rectangles.sort((a, b) => a.x1 - b.x1);

    const overlappingRectangles = [];
    let activeRectangles = [];

    for (const rect of this.rectangles) {
      activeRectangles = activeRectangles.filter(
        activeRect => activeRect.x2 > rect.x1
      );

      for (const activeRect of activeRectangles) {
        if (this.doRectanglesOverlap(activeRect, rect)) {
          overlappingRectangles.push([originalRectangles.indexOf(activeRect), originalRectangles.indexOf(rect)]);
        }
      }

      activeRectangles.push(rect);
    }

    this.rectangles = originalRectangles;

    return overlappingRectangles;
  }

    doRectanglesOverlap(rect1, rect2) {
        return (
            rect1.x2 > rect2.x1 &&
            rect1.x1 < rect2.x2 &&
            rect1.y2 > rect2.y1 &&
            rect1.y1 < rect2.y2
        );
    }
}

function runAlgorithm() {
  const algorithm = document.getElementById("algorithm").value;

  if (algorithm === "Algorithm_1" || algorithm === "Algorithm_2") {
      const fileInput = document.getElementById("fileInput");
      const file = fileInput.files[0];

      if (file) {
          readFileAsync(file, function(data) {
              const lines = data.split('\n');
              let rectangleAlgorithm;

              if (algorithm === "Algorithm_1") {
                  rectangleAlgorithm = new BruteForce();
              } else if (algorithm === "Algorithm_2") {
                  rectangleAlgorithm = new SweepLine();
              }

              lines.forEach((line, index) => {
                  const match = line.match(/x1=(\d+); y1=(\d+); x2=(\d+); y2=(\d+);/);
                  if (match) {
                      const [, x1, y1, x2, y2] = match.map(Number);
                      rectangleAlgorithm.addRectangle(new Rectangle(x1, y1, x2, y2));
                  } else {
                      console.error(`Error in line ${index + 1}: ${line}`);
                  }
              });

              console.time(algorithm);
              const overlappingRectangles = rectangleAlgorithm.findOverlappingRectangles();
              console.timeEnd(algorithm);

              displayResult(rectangleAlgorithm.rectangles, overlappingRectangles);
              highlightOverlappingRectangles(rectangleAlgorithm.rectangles, overlappingRectangles);

              showNotification(`${algorithm} applied successfully`);
          });
      }
  }
}

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 2500);
  }

  const style = document.createElement('style');
  document.head.appendChild(style);


  function displayResult(rectangles, overlappingRectangles) {
    const canvas = document.getElementById('rectangleCanvas');
    const ctx = canvas.getContext('2d');
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    rectangles.forEach((rect, index) => {
      if (rect && typeof rect.x1 !== 'undefined' && typeof rect.y1 !== 'undefined' && typeof rect.x2 !== 'undefined' && typeof rect.y2 !== 'undefined') {
        ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
  
        const centerX = rect.x1 + (rect.x2 - rect.x1) / 2;
        const centerY = rect.y1 + (rect.y2 - rect.y1) / 2;
  
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, centerX, centerY);
      } else {
        console.error(`Invalid rectangle data at index ${index}: ${JSON.stringify(rect)}`);
      }
    });
  
    overlappingRectangles.forEach(([index1, index2]) => {
      const rect1 = rectangles[index1];
      const rect2 = rectangles[index2];
  
      if (rect1 && rect2) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(rect1.x1, rect1.y1, rect1.x2 - rect1.x1, rect1.y2 - rect1.y1);
        ctx.strokeRect(rect2.x1, rect2.y1, rect2.x2 - rect2.x1, rect2.y2 - rect2.y1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
      } else {
        console.error(`Invalid rectangles data: rect1=${JSON.stringify(rect1)}, rect2=${JSON.stringify(rect2)}`);
      }
    });

    const existingResultContainer = document.getElementById('resultContainer');
    if (existingResultContainer) {
        document.body.removeChild(existingResultContainer);
    }
        const resultContainer = document.createElement('div');
        resultContainer.id = 'resultContainer';
        resultContainer.innerHTML = '<h2>List of rectangles and their coordinates:</h2>';
        rectangles.forEach((rect, index) => {
        const rectangleInfo = document.createElement('p');
        rectangleInfo.innerHTML = `Rectangle ${index + 1}: x1=${rect.x1}, y1=${rect.y1}, x2=${rect.x2}, y2=${rect.y2}`;
        resultContainer.appendChild(rectangleInfo);
    });
        document.body.appendChild(resultContainer);
  }


  function highlightOverlappingRectangles(rectangles, overlappingRectangles) {
    const canvas = document.getElementById('rectangleCanvas');
    const ctx = canvas.getContext('2d');
  
    overlappingRectangles.forEach(([index1, index2]) => {
        const rect1 = rectangles[index1];
        const rect2 = rectangles[index2];
      if (rect1 && rect2) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(rect1.x1, rect1.y1, rect1.x2 - rect1.x1, rect1.y2 - rect1.y1);
        ctx.strokeRect(rect2.x1, rect2.y1, rect2.x2 - rect2.x1, rect2.y2 - rect2.y1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
      } else {
        console.error(`Invalid rectangles data: rect1=${JSON.stringify(rect1)}, rect2=${JSON.stringify(rect2)}`);
      }
    });
  }
  
 
  function readFileAsync(file, callback) {
    const reader = new FileReader();

    reader.onload = function(e) {
      const data = e.target.result;
      callback(data);
    };

    reader.readAsText(file);
  }

  function handleFileChange(event) {
    const fileInput = document.getElementById("fileInput");
    const file = fileInput.files[0];
  
    if (file) {
      readFileAsync(file, function(data) {
        const lines = data.split('\n');
        let rectangleAlgorithm;
  
        const algorithm = document.getElementById("algorithm").value;
        if (algorithm === "Algorithm_1") {
          rectangleAlgorithm = new BruteForce();
        } else if (algorithm === "Algorithm_2") {
          rectangleAlgorithm = new SweepLine();
        }
  
        lines.forEach((line, index) => {
          const match = line.match(/x1=(\d+); y1=(\d+); x2=(\d+); y2=(\d+);/);
          if (match) {
            const [, x1, y1, x2, y2] = match.map(Number);
            rectangleAlgorithm.addRectangle(new Rectangle(x1, y1, x2, y2));
          } else {
            console.error(`Error in line ${index + 1}: ${line}`);
          }
        });
  
        displayResult(rectangleAlgorithm.rectangles, []);
  
        showNotification("File loaded. Click 'Run the algorithm' to process.");
      });
    }
  }
  
  function runAlgorithmOnClick() {
    runAlgorithm();
  }