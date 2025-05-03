// Slideshow logic
(function () {
  // Lấy các phần tử liên quan đến slideshow
  const slides = document.querySelectorAll('#slideshow img'); // Danh sách các ảnh trong slideshow
  const slideInfoText = document.getElementById('slide-info-text'); // Phần hiển thị thông tin ảnh
  const dots = document.querySelectorAll('.dot'); // Các chấm điều hướng
  const prevBtn = document.getElementById('prev-btn'); // Nút chuyển về ảnh trước
  const nextBtn = document.getElementById('next-btn'); // Nút chuyển sang ảnh tiếp theo
  const slideCount = slides.length; // Tổng số ảnh trong slideshow
  let current = 0; // Chỉ số ảnh hiện tại
  let slideInterval; // Biến lưu khoảng thời gian tự động chuyển ảnh

  // Danh sách chú thích cho từng ảnh
  const slideCaptions = [
    "Ảnh sản phẩm 1",
    "Ảnh sản phẩm 2",
    "Ảnh sản phẩm 3",
    "Ảnh sản phẩm 4",
    "Ảnh sản phẩm 5"
  ];

  // Hiển thị ảnh theo chỉ số
  function showSlide(index) {
    slides.forEach((img, i) => {
      img.classList.toggle('active', i === index); // Hiển thị ảnh hiện tại
      dots[i].classList.toggle('active', i === index); // Làm nổi bật chấm tương ứng
      dots[i].setAttribute('aria-selected', i === index ? 'true' : 'false'); // Cập nhật trạng thái truy cập
      dots[i].setAttribute('tabindex', i === index ? '0' : '-1'); // Chỉ cho phép tab vào chấm hiện tại
    });
    slideInfoText.textContent = slideCaptions[index]; // Cập nhật chú thích ảnh
    current = index; // Lưu chỉ số ảnh hiện tại
  }

  // Chuyển sang ảnh tiếp theo
  function nextSlide() {
    current = (current + 1) % slideCount; // Tăng chỉ số ảnh, quay lại 0 nếu vượt quá
    showSlide(current);
  }

  // Chuyển về ảnh trước đó
  function prevSlide() {
    current = (current - 1 + slideCount) % slideCount; // Giảm chỉ số ảnh, quay lại cuối nếu nhỏ hơn 0
    showSlide(current);
  }

  // Bắt đầu tự động chuyển ảnh
  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 5000); // Chuyển ảnh mỗi 5 giây
  }

  // Dừng tự động chuyển ảnh
  function stopAutoPlay() {
    clearInterval(slideInterval); // Xóa khoảng thời gian tự động
  }

  // Khởi tạo slideshow
  showSlide(0); // Hiển thị ảnh đầu tiên
  startAutoPlay(); // Bắt đầu tự động chuyển ảnh

  // Sự kiện khi nhấn nút "Tiếp theo"
  nextBtn.addEventListener('click', () => {
    stopAutoPlay(); // Dừng tự động chuyển ảnh
    nextSlide(); // Chuyển sang ảnh tiếp theo
    startAutoPlay(); // Bắt đầu lại tự động chuyển ảnh
  });

  // Sự kiện khi nhấn nút "Trước đó"
  prevBtn.addEventListener('click', () => {
    stopAutoPlay(); // Dừng tự động chuyển ảnh
    prevSlide(); // Chuyển về ảnh trước đó
    startAutoPlay(); // Bắt đầu lại tự động chuyển ảnh
  });

  // Sự kiện khi nhấn vào các chấm điều hướng
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoPlay(); // Dừng tự động chuyển ảnh
      showSlide(index); // Hiển thị ảnh tương ứng với chấm
      startAutoPlay(); // Bắt đầu lại tự động chuyển ảnh
    });

    // Hỗ trợ truy cập bằng bàn phím (Enter hoặc Space)
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // Ngăn hành động mặc định
        stopAutoPlay(); // Dừng tự động chuyển ảnh
        showSlide(index); // Hiển thị ảnh tương ứng
        startAutoPlay(); // Bắt đầu lại tự động chuyển ảnh
      }
    });
  });
})();

// Nhận thông tin từ form và gửi đến Google Apps Script
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('dataForm'); // Lấy form đăng ký
  const responseMsg = document.getElementById('responseMsg'); // Phần hiển thị thông báo phản hồi

  // Xử lý sự kiện khi form được gửi
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn hành động mặc định của form (reload trang)

    const formData = new FormData(form); // Thu thập dữ liệu từ form
    if (!formData.has("allow")) {
      formData.append("allow", "Không đồng ý"); // Thêm giá trị mặc định nếu checkbox không được chọn
    }

    // Gửi dữ liệu đến Google Apps Script
    fetch("https://script.google.com/macros/s/AKfycbzMkEIki8oe0V9-FfLprU0N4FGGuSKNWR0Thuq5nA_ELSUaaiFn7eFLhu8Vvgt8Ojc/exec", {
      method: "POST", // Phương thức gửi dữ liệu
      body: formData // Dữ liệu từ form
    })
      .then(res => res.json()) // Chuyển đổi phản hồi thành JSON
      .then(data => {
        if (data.result === "success") {
          // Hiển thị thông báo thành công
          responseMsg.innerText = `✅ Cảm ơn bạn đã đăng ký nhận tư vấn! Chúng tôi sẽ liên hệ sớm nhất.`;
          responseMsg.style.color = 'green';
          form.reset(); // Reset form sau khi gửi thành công
        } else {
          // Hiển thị lỗi từ server
          responseMsg.innerText = `❌ Lỗi: ${data.error}`;
          responseMsg.style.color = 'red';
        }
      })
      .catch(err => {
        // Hiển thị lỗi kết nối
        responseMsg.innerText = `⚠️ Kết nối thất bại: ${err}`;
        responseMsg.style.color = 'red';
      });
  });
});

// Hiển thị popup khi form được gửi
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('dataForm'); // Lấy form
  const popup = document.getElementById('success-popup'); // Lấy popup
  const closePopupButton = document.getElementById('close-popup'); // Lấy nút đóng popup

  // Xử lý sự kiện khi form được gửi
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Ngăn reload trang

    // Hiển thị popup
    popup.classList.remove('hidden');
  });

  // Xử lý sự kiện khi nhấn nút đóng popup
  closePopupButton.addEventListener('click', function () {
    popup.classList.add('hidden'); // Ẩn popup
  });
});

// Cuộn đến form khi nhấn nút "Đăng ký ngay"
document.getElementById('scroll-to-form').addEventListener('click', function () {
  const formSection = document.getElementById('consultation-form'); // Lấy phần tử form
  formSection.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt đến form
  
});

// Hàm tạo số ngẫu nhiên trong khoảng từ min đến max
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cập nhật số người xem ngẫu nhiên mỗi 5 giây
setInterval(() => {
  const viewerCountElement = document.getElementById('viewer-count'); // Lấy phần tử chứa số người xem
  const randomViewerCount = getRandomNumber(500, 4000); // Tạo số ngẫu nhiên từ 500 đến 1000
  viewerCountElement.textContent = randomViewerCount; // Cập nhật nội dung của phần tử
}, 5000); // Thực hiện mỗi 5 giây

// Đếm ngược thời gian
document.addEventListener('DOMContentLoaded', function () {
  const countdownElement = document.getElementById('countdown-timer'); // Lấy phần tử hiển thị thời gian
  const hoursElement = countdownElement.querySelector('.hours'); // Phần tử hiển thị giờ
  const minutesElement = countdownElement.querySelector('.minutes'); // Phần tử hiển thị phút
  const secondsElement = countdownElement.querySelector('.seconds'); // Phần tử hiển thị giây

  let totalSeconds = 7 * 60 * 60; // Tổng số giây (7 giờ)

  // Hàm cập nhật thời gian
  function updateCountdown() {
    const hours = Math.floor(totalSeconds / 3600); // Tính số giờ
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Tính số phút
    const seconds = totalSeconds % 60; // Tính số giây

    // Cập nhật nội dung các phần tử
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');

    // Giảm tổng số giây
    totalSeconds--;

    // Dừng đếm ngược khi hết giờ
    if (totalSeconds < 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "Hết giờ!"; // Hiển thị thông báo khi hết thời gian
    }
  }

  // Gọi hàm cập nhật mỗi giây
  const countdownInterval = setInterval(updateCountdown, 1000);

  // Gọi ngay lần đầu để hiển thị đúng thời gian ban đầu
  updateCountdown();
});
