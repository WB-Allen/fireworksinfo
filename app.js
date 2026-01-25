document.addEventListener('DOMContentLoaded', () => {
    let allData = window.FIREWORKS_DATA || [];
    let currentCategory = '全部';

    const sidebar = document.getElementById('sidebar');
    const productList = document.getElementById('product-list');
    const currentCategoryTitle = document.getElementById('current-category');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');

    // Initialize application
    initApp();

    // Modal click to close
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
    });

    function initApp() {
        renderSidebar();
        renderProducts();
    }

    function renderSidebar() {
        // Extract unique categories
        const categories = ['全部', ...new Set(allData.map(item => item['分类']))];

        sidebar.innerHTML = categories.map(cat => `
            <div class="nav-item ${cat === currentCategory ? 'active' : ''}" data-category="${cat}">
                ${cat}
            </div>
        `).join('');

        // Add click events
        sidebar.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const category = item.getAttribute('data-category');
                switchCategory(category);
            });
        });
    }

    function switchCategory(category) {
        if (currentCategory === category) return;

        currentCategory = category;
        currentCategoryTitle.textContent = category;

        // Update sidebar UI
        sidebar.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-category') === category);
        });

        renderProducts();
    }

    function renderProducts() {
        const filteredData = currentCategory === '全部'
            ? allData
            : allData.filter(item => item['分类'] === currentCategory);

        productList.innerHTML = filteredData.map(product => createProductCard(product)).join('');

        // Add zoom events after rendering
        productList.querySelectorAll('.product-img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                modal.style.display = 'flex';
                modalImg.src = img.src;
                document.body.style.overflow = 'hidden'; // Prevent main scroll
            });
        });
    }

    function createProductCard(product) {
        const hasLabel = product['标签'] && product['标签'].trim() !== '';
        const hasVideo = product['视频地址'] && product['视频地址'].trim() !== '';
        const hasPoint = product['卖点'] && product['卖点'].trim() !== '';
        const hasDuration = product['燃放时长'] && product['燃放时长'].trim() !== '';

        // Image path logic
        let imgName = product['商品图片'];
        // The Excel might have name without extension or just name
        // We know they are in files_img/
        let imgSrc = `files_img/${imgName}`;
        if (!imgName.includes('.')) {
            imgSrc += '.jpeg'; // Default to jpeg based on file list
        }

        return `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <img src="${imgSrc}" class="product-img" alt="${product['名称']}" onerror="this.src='https://via.placeholder.com/100x100?text=Firework'">
                </div>
                <div class="product-info">
                    <div>
                        <div class="product-head">
                            <div class="product-name">${product['名称']}</div>
                        </div>
                        <div class="product-selling-point">
                            ${hasLabel ? `<span class="tag">${product['标签']}</span>` : ''}
                            <span>${product['卖点']}</span>
                        </div>
                        <div class="product-meta">
                            <div>规格: ${product['规格']}</div>
                            ${hasDuration ? `<div>时长: ${product['燃放时长']}</div>` : ''}
                        </div>
                    </div>
                    ${hasVideo ? `
                        <a href="${product['视频地址']}" class="video-btn" target="_blank">
                            <span>▶ 查看燃放效果</span>
                        </a>
                    ` : ''}
                </div>
                <div class="price-container">
                    <span class="price-symbol">¥</span>
                    <span class="price-value">${product['售价']}</span>
                </div>
            </div>
        `;
    }
});
