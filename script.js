// DOM要素の取得
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const planTypeSelect = document.getElementById('plan-type');

// 初期化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// アプリの初期化
function initializeApp() {
    setupNavigation();
    setupScrollAnimations();
    setupFormValidation();
    setupModalHandlers();
    setupSmoothScrolling();
    
    // デフォルトで新婚旅行プランを表示
    selectMainPlan('honeymoon');
    selectSubPlan('honeymoon', 'standard');
}

// ナビゲーションの設定
function setupNavigation() {
    // モバイルメニューのトグル
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // ヘッダーのスクロール効果
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // ナビゲーションリンクのアクティブ状態
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // モバイルメニューを閉じる
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// スクロールアニメーションの設定
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // アニメーション対象要素を監視
    const animatedElements = document.querySelectorAll('.target-card, .plan-detail, .benefit-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// スムーススクロールの設定
function setupSmoothScrolling() {
    // セクションへのスムーススクロール
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
}

// メインプラン選択機能
function selectMainPlan(mainPlanType) {
    // すべてのメインタブのアクティブ状態を解除
    const allMainTabs = document.querySelectorAll('.main-plan-tab');
    allMainTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 選択されたメインタブをアクティブに
    const selectedMainTab = document.querySelector(`[data-main-plan="${mainPlanType}"]`);
    if (selectedMainTab) {
        selectedMainTab.classList.add('active');
    }

    // すべての派生プランセクションを非表示
    const allSubPlanSections = document.querySelectorAll('.sub-plan-section');
    allSubPlanSections.forEach(section => {
        section.style.display = 'none';
    });

    // 選択された派生プランセクションを表示
    const selectedSubPlanSection = document.getElementById(mainPlanType + '-sub-plans');
    if (selectedSubPlanSection) {
        selectedSubPlanSection.style.display = 'block';
        
        // 最初の派生プランを選択
        const firstSubTab = selectedSubPlanSection.querySelector('.sub-plan-tab');
        if (firstSubTab) {
            firstSubTab.click();
        }
    }
}

// 派生プラン選択機能
function selectSubPlan(mainPlanType, subPlanType) {
    // 現在のメインプランの派生タブのアクティブ状態を解除
    const currentSubTabs = document.querySelectorAll(`#${mainPlanType}-sub-plans .sub-plan-tab`);
    currentSubTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 選択された派生タブをアクティブに
    const selectedSubTab = document.querySelector(`#${mainPlanType}-sub-plans [data-sub-plan="${subPlanType}"]`);
    if (selectedSubTab) {
        selectedSubTab.classList.add('active');
    }

    // すべてのプラン詳細を非表示
    const allPlans = document.querySelectorAll('.plan-detail');
    allPlans.forEach(plan => {
        plan.style.display = 'none';
    });

    // 選択されたプラン詳細を表示
    const selectedPlan = document.getElementById(`${mainPlanType}-${subPlanType}-plan`);
    if (selectedPlan) {
        selectedPlan.style.display = 'block';
        
        // 価格比較を更新
        updatePriceComparison(`${mainPlanType}-${subPlanType}`);
        
        // プランセクションにスクロール
        const plansSection = document.getElementById('plans');
        if (plansSection) {
            plansSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// プラン選択機能（後方互換性のため）
function selectPlan(planType) {
    // 既存のプランタイプを新しい構造にマッピング
    if (planType === 'honeymoon') {
        selectMainPlan('honeymoon');
        selectSubPlan('honeymoon', 'standard');
    } else if (planType === 'second-honeymoon') {
        selectMainPlan('second-honeymoon');
        selectSubPlan('second-honeymoon', 'comfort');
    }
}

// プラン詳細の表示（後方互換性のため）
function showPlanDetails(planType) {
    selectPlan(planType);
}

// モーダルハンドラーの設定
function setupModalHandlers() {
    // モーダルを開く
    window.openBookingForm = function(planType) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // プランタイプを設定
        if (planTypeSelect) {
            planTypeSelect.value = planType;
        }
        
        // モーダルタイトルを更新
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            if (planType === 'honeymoon') {
                modalTitle.textContent = '憧れのハネムーン in HAWAII - 予約・相談';
            } else if (planType === 'second-honeymoon') {
                modalTitle.textContent = '人生第二章、思い出再発見の旅 - 予約・相談';
            }
        }
    };

    // モーダルを閉じる
    window.closeBookingModal = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        bookingForm.reset();
    };

    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeBookingModal();
        }
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeBookingModal();
        }
    });
}

// フォームバリデーションの設定
function setupFormValidation() {
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitForm();
            }
        });
    }

    // リアルタイムバリデーション
    const formInputs = document.querySelectorAll('#booking-form input, #booking-form select, #booking-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// フォームバリデーション
function validateForm() {
    const requiredFields = [
        'plan-type',
        'company-name',
        'name',
        'email',
        'phone',
        'travel-date',
        'participants'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 個別フィールドのバリデーション
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    // 必須チェック
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'この項目は必須です');
        return false;
    }
    
    // メールアドレスの形式チェック
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '正しいメールアドレスを入力してください');
            return false;
        }
    }
    
    // 電話番号の形式チェック
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\-\+\(\)\s]+$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, '正しい電話番号を入力してください');
            return false;
        }
    }
    
    // 日付のチェック
    if (field.type === 'date' && value) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(field, '未来の日付を選択してください');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

// フィールドエラーの表示
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    field.style.backgroundColor = '#fdf2f2';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.3rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// フィールドエラーのクリア
function clearFieldError(field) {
    field.style.borderColor = '';
    field.style.backgroundColor = '';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// フォーム送信
function submitForm() {
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);
    
    // ローディング状態を表示
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
    submitButton.disabled = true;
    
    // 実際の送信処理（ここではシミュレーション）
    setTimeout(() => {
        // 成功メッセージを表示
        showSuccessMessage();
        
        // フォームをリセット
        bookingForm.reset();
        
        // ボタンを元に戻す
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // モーダルを閉じる
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
        
    }, 2000);
}

// 成功メッセージの表示
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        お問い合わせを受け付けました。担当者より2営業日以内にご連絡いたします。
    `;
    
    document.body.appendChild(successDiv);
    
    // 3秒後に自動で削除
    setTimeout(() => {
        successDiv.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 3000);
}

// 価格計算機能
function calculatePrice(planType, participants, priceType = 'company') {
    const prices = {
        // 新婚旅行プラン（2名分の価格）
        'honeymoon-standard': {
            regular: 700000,      // 通常価格（2名分）
            company: 630000,      // 企業割引価格（2名分）
            companySupport: 150000 // 企業支援額
        },
        'honeymoon-premium': {
            regular: 850000,      // 通常価格（2名分）
            company: 765000,      // 企業割引価格（2名分）
            companySupport: 200000 // 企業支援額
        },
        'honeymoon-luxury': {
            regular: 1000000,     // 通常価格（2名分）
            company: 900000,      // 企業割引価格（2名分）
            companySupport: 250000 // 企業支援額
        },
        // セカンドハネムーンプラン（2名分の価格）
        'second-honeymoon-comfort': {
            regular: 600000,      // 通常価格（2名分）
            company: 540000,      // 企業割引価格（2名分）
            companySupport: 120000 // 企業支援額
        },
        'second-honeymoon-deluxe': {
            regular: 1200000,     // 通常価格（2名分）
            company: 1080000,     // 企業割引価格（2名分）
            companySupport: 300000 // 企業支援額
        },
        'second-honeymoon-wellness': {
            regular: 1400000,     // 通常価格（2名分）
            company: 1260000,     // 企業割引価格（2名分）
            companySupport: 350000 // 企業支援額
        }
    };
    
    const plan = prices[planType];
    if (!plan) return null;
    
    // 参加人数に応じた価格計算（2名基準）
    const basePrice = plan[priceType];
    const totalPrice = Math.round(basePrice * (participants / 2));
    const companySupport = Math.round(plan.companySupport * (participants / 2));
    const finalPrice = Math.max(totalPrice - companySupport, 0);
    
    return {
        regular: Math.round(plan.regular * (participants / 2)),
        company: totalPrice,
        companySupport: companySupport,
        final: finalPrice,
        savings: Math.round(plan.regular * (participants / 2)) - finalPrice
    };
}

// 価格比較表示の更新
function updatePriceComparison(planType) {
    const participants = 2; // デフォルト参加人数
    const prices = calculatePrice(planType, participants);
    
    if (!prices) return;
    
    // 価格比較カードの更新
    const individualPrice = document.getElementById('individual-price');
    const companyPrice = document.getElementById('company-price');
    const savingsAmount = document.getElementById('savings-amount');
    
    if (individualPrice) {
        individualPrice.textContent = `¥${prices.original.toLocaleString()}`;
    }
    
    if (companyPrice) {
        companyPrice.textContent = `¥${prices.final.toLocaleString()}`;
    }
    
    if (savingsAmount) {
        const savings = prices.original - prices.final;
        savingsAmount.textContent = `¥${savings.toLocaleString()}`;
    }
}

// 動的価格表示の更新
function updatePriceDisplay(planType, participants = 2) {
    const prices = calculatePrice(planType, participants);
    if (!prices) return;
    
    const priceElements = document.querySelectorAll(`#${planType}-plan .pricing-info`);
    priceElements.forEach(element => {
        const originalPrice = element.querySelector('.original-price span');
        const discountedPrice = element.querySelector('.discounted-price span');
        const finalPrice = element.querySelector('.final-price span');
        
        if (originalPrice) {
            originalPrice.textContent = `通常価格: ¥${prices.original.toLocaleString()}`;
        }
        if (discountedPrice) {
            discountedPrice.textContent = `企業割引価格: ¥${prices.discounted.toLocaleString()}`;
        }
        if (finalPrice) {
            finalPrice.textContent = `あなたの負担: ¥${prices.final.toLocaleString()}`;
        }
    });
}

// 価格タイプ選択機能
function selectPriceType(planType, priceType) {
    // 現在のプランの価格タイプボタンのアクティブ状態を更新
    const currentButtons = document.querySelectorAll(`[onclick*="${planType}"]`);
    currentButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-price-type') === priceType) {
            btn.classList.add('active');
        }
    });
    
    // 価格表示を更新
    updatePlanPrice(planType, priceType);
}

// プラン価格更新関数
function updatePlanPrice(planType, priceType = 'company') {
    const participants = parseInt(document.getElementById(`${planType}-participants`).value);
    const prices = calculatePrice(planType, participants, priceType);
    
    if (prices) {
        // 通常価格
        document.getElementById(`${planType}-regular`).textContent = `¥${prices.regular.toLocaleString()}`;
        
        // 企業割引価格（企業割引選択時のみ表示）
        const companyItem = document.getElementById(`${planType}-company-item`);
        const companyPrice = document.getElementById(`${planType}-company`);
        const supportItem = document.getElementById(`${planType}-support-item`);
        const supportPrice = document.getElementById(`${planType}-support`);
        const savingsHighlight = document.getElementById(`${planType}-savings-highlight`);
        
        if (priceType === 'company') {
            companyItem.style.display = 'flex';
            supportItem.style.display = 'flex';
            savingsHighlight.style.display = 'flex';
            companyPrice.textContent = `¥${prices.company.toLocaleString()}`;
            supportPrice.textContent = `¥${prices.companySupport.toLocaleString()}`;
            document.getElementById(`${planType}-final`).textContent = `¥${prices.final.toLocaleString()}`;
            document.getElementById(`${planType}-savings`).textContent = `¥${prices.savings.toLocaleString()}`;
        } else {
            companyItem.style.display = 'none';
            supportItem.style.display = 'none';
            savingsHighlight.style.display = 'none';
            document.getElementById(`${planType}-final`).textContent = `¥${prices.regular.toLocaleString()}`;
        }
    }
}

// 各プランの価格更新関数
function updateHoneymoonStandardPrice() {
    const activeButton = document.querySelector('[onclick*="honeymoon"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('honeymoon', priceType);
}

function updateHoneymoonPremiumPrice() {
    const activeButton = document.querySelector('[onclick*="honeymoon-premium"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('honeymoon-premium', priceType);
}

function updateHoneymoonLuxuryPrice() {
    const activeButton = document.querySelector('[onclick*="honeymoon-luxury"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('honeymoon-luxury', priceType);
}

function updateSecondHoneymoonComfortPrice() {
    const activeButton = document.querySelector('[onclick*="second-honeymoon-comfort"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('second-honeymoon-comfort', priceType);
}

function updateSecondHoneymoonDeluxePrice() {
    const activeButton = document.querySelector('[onclick*="second-honeymoon-deluxe"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('second-honeymoon-deluxe', priceType);
}

function updateSecondHoneymoonWellnessPrice() {
    const activeButton = document.querySelector('[onclick*="second-honeymoon-wellness"][data-price-type].active');
    const priceType = activeButton ? activeButton.getAttribute('data-price-type') : 'company';
    updatePlanPrice('second-honeymoon-wellness', priceType);
}

// 後方互換性のための関数
function updateHoneymoonPrice() {
    updateHoneymoonStandardPrice();
}

function updateSecondHoneymoonPrice() {
    updateSecondHoneymoonComfortPrice();
}

// 参加人数変更時の価格更新（後方互換性のため）
if (planTypeSelect) {
    planTypeSelect.addEventListener('change', function() {
        const participants = document.getElementById('participants').value || 2;
        updatePriceDisplay(this.value, parseInt(participants));
    });
}

const participantsSelect = document.getElementById('participants');
if (participantsSelect) {
    participantsSelect.addEventListener('change', function() {
        const planType = planTypeSelect.value;
        if (planType) {
            updatePriceDisplay(planType, parseInt(this.value));
        }
    });
}

// パフォーマンス最適化
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// スクロールイベントの最適化
const optimizedScrollHandler = debounce(function() {
    // スクロール関連の処理
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// 画像の遅延読み込み
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('アプリケーションエラー:', e.error);
    // エラー通知の表示（本番環境では適切なエラーハンドリングを実装）
});

// アニメーション用のCSSを動的に追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: var(--shadow-medium);
        padding: 1rem;
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// 初期化完了
console.log('ハワイだなもアプリが正常に初期化されました');
