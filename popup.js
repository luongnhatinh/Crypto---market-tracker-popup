document.addEventListener('DOMContentLoaded', async () => {
  const refreshBtn = document.getElementById('refresh-btn');
  const addBtn = document.getElementById('add-btn');
  const coinInput = document.getElementById('coin-input');
  const listContainer = document.getElementById('crypto-list-container');

  // Bản đồ màu sắc có sẵn cho các mã phổ biến để tối ưu thẩm mỹ
  const iconColors = {
    BTC: { bg: 'rgba(247, 147, 26, 0.15)', text: '#f7931a', border: 'rgba(247, 147, 26, 0.3)' },
    ETH: { bg: 'rgba(98, 126, 234, 0.15)', text: '#627eea', border: 'rgba(98, 126, 234, 0.3)' },
    SOL: { bg: 'rgba(20, 241, 149, 0.15)', text: '#14f195', border: 'rgba(20, 241, 149, 0.3)' },
    BNB: { bg: 'rgba(240, 185, 11, 0.15)', text: '#f0b90b', border: 'rgba(240, 185, 11, 0.3)' },
    ADA: { bg: 'rgba(0, 51, 153, 0.15)', text: '#3cc8ff', border: 'rgba(0, 51, 153, 0.3)' },
    FPT: { bg: 'rgba(247, 128, 32, 0.15)', text: '#f78020', border: 'rgba(247, 128, 32, 0.3)' }, // Cam FPT
    HPG: { bg: 'rgba(0, 84, 166, 0.15)', text: '#0054a6', border: 'rgba(0, 84, 166, 0.3)' }, // Xanh Hòa Phát
    VIC: { bg: 'rgba(238, 28, 37, 0.15)', text: '#ee1c25', border: 'rgba(238, 28, 37, 0.3)' }  // Đỏ Vingroup
  };

  const unicodeSymbols = {
    BTC: '₿',
    ETH: 'Ξ',
    SOL: 'S',
    DOGE: 'Ð'
  };

  // Tự động tạo màu sắc HSL đồng nhất dựa theo ký tự mã
  function getCoinStyles(cleanSymbol) {
    if (iconColors[cleanSymbol]) return iconColors[cleanSymbol];
    
    let hash = 0;
    for (let i = 0; i < cleanSymbol.length; i++) {
      hash = cleanSymbol.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    return {
      bg: `hsla(${h}, 70%, 50%, 0.12)`,
      text: `hsl(${h}, 85%, 65%)`,
      border: `hsla(${h}, 70%, 50%, 0.25)`
    };
  }

  function getUnicodeSymbol(cleanSymbol) {
    return unicodeSymbols[cleanSymbol] || cleanSymbol.charAt(0);
  }

  // Chuyển đổi linh hoạt môi trường lưu trữ (Chrome Storage vs LocalStorage)
  const storage = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local
    ? {
        get: (key) => new Promise((resolve) => chrome.storage.local.get(key, resolve)),
        set: (data) => new Promise((resolve) => chrome.storage.local.set(data, resolve))
      }
    : {
        get: async (key) => ({ [key]: JSON.parse(localStorage.getItem(key)) }),
        set: async (data) => Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)))
      };

  // Đọc danh sách theo dõi, mặc định có 2 mã Crypto và 1 mã cổ phiếu VN
  let result = await storage.get('coins');
  let coinList = result.coins || ['BTC-USD', 'ETH-USD', 'FPT.VN'];

  // Hàm định dạng giá dựa trên loại tiền tệ
  function formatCurrency(price, currency) {
    if (currency === 'VND') {
      // Cổ phiếu Việt Nam thường được tính bằng VND
      return `${price.toLocaleString('vi-VN')} ₫`;
    } else {
      // Các thị trường khác và Crypto tính bằng USD hoặc các loại tệ gốc
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: price >= 1000 ? 2 : 4
      });
    }
  }

  // Vẽ danh sách thẻ lên giao diện
  function renderList() {
    listContainer.innerHTML = '';
    
    if (coinList.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          Danh sách theo dõi trống.<br>Nhập mã Crypto hoặc Cổ phiếu phía trên để thêm!
        </div>
      `;
      return;
    }

    coinList.forEach((symbol) => {
      // Tách sạch phần hậu tố (e.g. BTC-USD -> BTC, FPT.VN -> FPT)
      const cleanSymbol = symbol.split('-')[0].split('.')[0];
      const styles = getCoinStyles(cleanSymbol);
      const unicode = getUnicodeSymbol(cleanSymbol);
      
      const card = document.createElement('div');
      card.className = 'crypto-card';
      card.id = `card-${symbol.toLowerCase().replace('.', '-').replace('-', '_')}`;
      
      card.innerHTML = `
        <div class="coin-info">
          <div class="coin-icon" style="background-color: ${styles.bg}; color: ${styles.text}; border: 1px solid ${styles.border}">
            ${unicode}
          </div>
          <div class="coin-meta">
            <span class="coin-symbol">${cleanSymbol}</span>
            <span class="coin-name" id="name-${symbol.toLowerCase().replace('.', '-').replace('-', '_')}">${cleanSymbol} / Thị trường</span>
          </div>
        </div>
        <div class="coin-stats">
          <span class="coin-price" id="price-${symbol.toLowerCase().replace('.', '-').replace('-', '_')}">Đang tải...</span>
          <span class="coin-change" id="change-${symbol.toLowerCase().replace('.', '-').replace('-', '_')}">--%</span>
        </div>
        <button class="btn-delete" title="Xóa khỏi danh sách" data-symbol="${symbol}">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      `;

      // Bắt sự kiện xóa
      const deleteBtn = card.querySelector('.btn-delete');
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const symToDelete = deleteBtn.getAttribute('data-symbol');
        coinList = coinList.filter(s => s !== symToDelete);
        await storage.set({ coins: coinList });
        renderList();
        fetchPrices(false);
        startAutoRefresh();
      });

      listContainer.appendChild(card);
    });
  }

  // Gọi Yahoo Finance API để cập nhật dữ liệu giá
  async function fetchPrices(isSilent = false) {
    if (coinList.length === 0) return;

    if (!isSilent) {
      refreshBtn.disabled = true;
      refreshBtn.innerHTML = `
        <svg class="refresh-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        Đang tải...
      `;
    } else {
      // Khi làm mới tự động (im lặng), chỉ hiển thị xoay tròn biểu tượng refresh ở chân trang
      const icon = refreshBtn.querySelector('.refresh-icon');
      if (icon) {
        icon.classList.add('spinning');
      }
    }

    try {
      await Promise.all(
        coinList.map(async (symbol) => {
          const domSafeId = symbol.toLowerCase().replace('.', '-').replace('-', '_');
          const priceEl = document.getElementById(`price-${domSafeId}`);
          const changeEl = document.getElementById(`change-${domSafeId}`);
          const nameEl = document.getElementById(`name-${domSafeId}`);

          try {
            const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
            if (!response.ok) {
              throw new Error('Lỗi tải dữ liệu');
            }

            const data = await response.json();
            const meta = data.chart.result[0].meta;
            
            const price = meta.regularMarketPrice;
            const prevClose = meta.previousClose || meta.chartPreviousClose;
            
            // Tính toán phần trăm thay đổi trong phiên hiện tại
            let changePercent = 0;
            if (prevClose && price) {
              changePercent = ((price - prevClose) / prevClose) * 100;
            }

            // Định dạng hiển thị
            const currency = meta.currency || 'USD';
            const formattedPrice = formatCurrency(price, currency);
            const formattedChange = `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`;
            
            // Lấy tên đầy đủ của cổ phiếu/coin từ Yahoo Finance
            const exchange = meta.fullExchangeName || meta.exchangeName || 'Market';
            const cleanName = meta.shortName || meta.longName || symbol.split('-')[0].split('.')[0];

            if (priceEl && changeEl) {
              priceEl.textContent = formattedPrice;
              changeEl.textContent = formattedChange;

              if (nameEl) {
                nameEl.textContent = `${cleanName} (${exchange})`;
                nameEl.title = cleanName; // Hiển thị tooltip khi di chuột vào
              }

              if (changePercent >= 0) {
                changeEl.classList.remove('negative');
                changeEl.classList.add('positive');
              } else {
                changeEl.classList.remove('positive');
                changeEl.classList.add('negative');
              }
            }
          } catch (err) {
            if (priceEl && changeEl) {
              priceEl.textContent = 'Lỗi tải';
              changeEl.textContent = '---';
              changeEl.classList.remove('positive', 'negative');
            }
          }
        })
      );
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tổng:', error);
    } finally {
      if (!isSilent) {
        refreshBtn.disabled = false;
        refreshBtn.innerHTML = `
          <svg class="refresh-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          Làm mới
        `;
      } else {
        const icon = refreshBtn.querySelector('.refresh-icon');
        if (icon) {
          icon.classList.remove('spinning');
        }
      }
    }
  }

  // Hàm thông minh kiểm tra và tự phân giải mã đầu vào (Crypto, VN Stock, US Stock)
  async function validateAndResolveSymbol(input) {
    // 3 phương án thử nghiệm theo thứ tự ưu tiên
    const candidates = [input];
    
    // Nếu người dùng nhập mã trơn không có ký hiệu đặc biệt, ta thử đoán hậu tố
    if (!input.includes('-') && !input.includes('.')) {
      candidates.push(`${input}-USD`); // Thử định dạng Crypto
      candidates.push(`${input}.VN`);  // Thử định dạng Cổ phiếu VN
    }

    for (const symbol of candidates) {
      try {
        const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          if (data.chart && data.chart.result && data.chart.result[0] && data.chart.result[0].meta) {
            const meta = data.chart.result[0].meta;
            if (meta.regularMarketPrice !== undefined) {
              return meta.symbol; // Trả về mã chính xác được Yahoo Finance chấp nhận
            }
          }
        }
      } catch (e) {
        // Lỗi kết nối hoặc không có dữ liệu, chuyển sang phương án tiếp theo
      }
    }
    return null;
  }

  // Xử lý khi người dùng thêm mã mới
  async function addCoin() {
    const rawVal = coinInput.value.trim().toUpperCase();
    if (!rawVal) return;

    // Hiển thị trạng thái đang kiểm tra
    addBtn.disabled = true;
    addBtn.innerHTML = `
      <svg class="refresh-icon spinning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width: 12px; height: 12px;">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
      </svg>
    `;

    // Gọi hàm kiểm tra và phân giải mã thông minh
    const resolvedSymbol = await validateAndResolveSymbol(rawVal);

    if (resolvedSymbol) {
      // Kiểm tra trùng lặp trên mã đã phân giải thực tế
      if (coinList.includes(resolvedSymbol)) {
        alert('Mã này đã tồn tại trong danh sách theo dõi!');
        coinInput.value = '';
      } else {
        coinList.push(resolvedSymbol);
        await storage.set({ coins: coinList });
        coinInput.value = '';
        renderList();
        fetchPrices(false);
        startAutoRefresh();
      }
    } else {
      alert(`Không thể xác thực mã "${rawVal}". \n\nHướng dẫn quy tắc nhập mã: \n- Cổ phiếu VN: Bắt buộc thêm đuôi ".VN" (Ví dụ: ACB.VN, HPG.VN, VNM.VN)\n- Crypto: BTC, ETH, SOL (Hệ thống tự động nhận diện)\n- Cổ phiếu Mỹ: AAPL, TSLA, ACB (Viết trơn không đuôi)`);
      coinInput.value = '';
    }

    // Khôi phục nút bấm
    addBtn.disabled = false;
    addBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;
  }

  // Quản lý đồng hồ tự động cập nhật
  let autoRefreshInterval;

  function startAutoRefresh() {
    stopAutoRefresh();
    // Tự động tải im lặng (silent) mỗi 5 giây
    autoRefreshInterval = setInterval(() => {
      fetchPrices(true);
    }, 5000);
  }

  function stopAutoRefresh() {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval);
    }
  }

  // Lắng nghe sự kiện người dùng
  addBtn.addEventListener('click', addCoin);
  coinInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addCoin();
  });

  // Sự kiện làm mới thủ công
  refreshBtn.addEventListener('click', () => {
    fetchPrices(false); // Gọi tải nổi bật (chặn nút bấm)
    startAutoRefresh();  // Reset lại chu kỳ tự động 5s
  });

  // Tải dữ liệu ban đầu khi mở popup
  renderList();
  fetchPrices(false);
  startAutoRefresh();
});
