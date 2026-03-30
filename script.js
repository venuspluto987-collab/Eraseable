const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const preview = document.getElementById("preview");

let drawing = false;
let img = new Image();

document.getElementById("upload").addEventListener("change", function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original image
            ctx.drawImage(img, 0, 0);

            // Add overlay
            ctx.fillStyle = "gray";
            ctx.globalAlpha = 0.9;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 1;

            updatePreview(); // show initial state
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(file);
});

// Start / stop drawing
canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
    drawing = false;
    updatePreview(); // update after erase
});

// Erase
canvas.addEventListener("mousemove", function(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
});

// 🔥 Update preview image
function updatePreview() {
    const dataURL = canvas.toDataURL("image/png");
    preview.src = dataURL;
}

// Download
function downloadImage() {
    const link = document.createElement("a");
    link.download = "edited.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}
