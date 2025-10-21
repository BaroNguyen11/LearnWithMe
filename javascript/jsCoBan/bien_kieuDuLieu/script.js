// Thiết lập Canvas và Context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Hàm resize và init lại hạt khi cửa sổ thay đổi
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles(); // Tạo lại các hạt để phù hợp với kích thước mới
});

// Định nghĩa lớp Particle
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 15 + 5; // Bán kính 5 đến 20
        // Vận tốc ngẫu nhiên, chậm (từ -0.5 đến 0.5)
        this.velocity = {
            x: (Math.random() - 0.5) * 0.8 * 3,
            y: (Math.random() - 0.5) * 0.8 * 3
        };
        // Màu gradient (HSLA)
        this.hue = Math.random() * 360;
        this.opacity = Math.random() * 0.4 + 0.2; // Độ trong suốt 0.2 đến 0.6
    }

    draw() {
        // Tạo gradient xuyên tâm (radial gradient) cho hiệu ứng lấp lánh 3D
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );

        // Thêm màu lấp lánh và màu nền mờ
        gradient.addColorStop(0.5, `hsla(${this.hue}, 50%, 70%, ${this.opacity})`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.draw();

        // 1. Cập nhật vị trí
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // 2. Kiểm tra va chạm với tường (Bounce back)
        if (this.x + this.radius > width || this.x - this.radius < 0) {
            this.velocity.x *= -1; // Đổi hướng x
        }
        if (this.y + this.radius > height || this.y - this.radius < 0) {
            this.velocity.y *= -1; // Đổi hướng y
        }

        // Tăng/giảm độ sáng (hue) nhẹ để tạo hiệu ứng nhấp nháy màu sắc
        this.hue += 0.1;
        if (this.hue > 360) this.hue = 0;
    }
}

// Khởi tạo các hạt
let particles = [];

function initParticles() {
    particles = [];
    // Tính toán số lượng hạt dựa trên diện tích màn hình
    const particleCount = Math.floor((width * height) / 40000); // Khoảng 30-80 hạt

    for (let i = 0; i < particleCount; i++) {
        // Khởi tạo ở vị trí ngẫu nhiên
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push(new Particle(x, y));
    }
}

// Gọi khởi tạo lần đầu
initParticles();

// Vòng lặp Animation chính
function animate() {
    requestAnimationFrame(animate);

    // Làm mờ khung hình cũ với độ trong suốt RẤT CAO
    // Điều này làm cho các hạt không có vệt mờ, tạo cảm giác chúng là các đối tượng rắn.

    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillRect(0, 0, width, height);

    // Đặt lại Composite Operation để vẽ các hạt
    ctx.globalCompositeOperation = 'source-over';

    // Cập nhật và vẽ từng hạt
    particles.forEach(particle => {
        particle.update();
    });
}

// Bắt đầu vòng lặp
animate();

