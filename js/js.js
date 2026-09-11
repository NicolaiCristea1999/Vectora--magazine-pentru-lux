 

        const vectoraGate = document.getElementById("vectoraGate");
        const gateStatus = document.getElementById("gateStatus");
        const cart = [];
        const cartNumber = document.getElementById("cartCount");
        const cartButton = document.getElementById("cartButton");
        const cartPanel = document.getElementById("cartPanel");
        const closeCart = document.getElementById("closeCart");
        const cartItems = document.getElementById("cartItems");
        const cartTotal = document.getElementById("cartTotal");
        const currencySelects = document.querySelectorAll(".currency-select");
        const checkoutButton = document.getElementById("checkoutButton");
        const checkoutModal = document.getElementById("checkoutModal");
        const closeCheckout = document.getElementById("closeCheckout");
        const checkoutForm = document.getElementById("checkoutForm");
        const formError = document.getElementById("formError");
        const orderSummaryItems = document.getElementById("orderSummaryItems");
        const orderSummaryTotal = document.getElementById("orderSummaryTotal");
        const message = document.getElementById("cartMessage");
        const buttons = document.querySelectorAll(".buy");
        const filterButtons = document.querySelectorAll(".filter-button");
        const products = document.querySelectorAll(".product");
        const reviewForm = document.getElementById("reviewForm");
        const savedReviews = document.getElementById("savedReviews");
        const reviewFormError = document.getElementById("reviewFormError");
        const savedReviewKey = "vectora-reviews";
        const savedReplyKey = "vectora-replies";
        const reviewsSection = document.getElementById("reviews");
        const registeredEmails = ["demo@gmail.com", "customer@example.com", "client@noire.md", "hello@noire.md"];
        const exchangeRate = 19.5;
        const commentRecipient = "nick.catia2019@gmail.com";
        const blockedWords = ["prost", "proastă", "prosti", "idiot", "idiotă", "fraier", "tâmpit", "tampit", "idiotule", "muie", "pula", "curva"];
        let currency = "MDL";

        window.vectoraVerified = function () {
            gateStatus.classList.add("verified");
            gateStatus.innerHTML = '<span class="status-dot"></span> Acces verificat';
            window.setTimeout(() => {
                vectoraGate.classList.add("gate-hidden");
                document.body.classList.remove("gate-active");
            }, 650);
        };

        document.body.classList.add("gate-active");

        function formatPrice(price) {
            const convertedPrice = currency === "EUR" ? price / exchangeRate : price;
            return `${convertedPrice.toLocaleString("ro-RO", { minimumFractionDigits: currency === "EUR" ? 2 : 0, maximumFractionDigits: 2 })} ${currency}`;
        }

        function formatBothCurrencies(price) {
            const mdl = price.toLocaleString("ro-RO", { maximumFractionDigits: 0 });
            const eur = (price / exchangeRate).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            return `${mdl} MDL / ${eur} EUR`;
        }

        function updateProductPrices() {
            products.forEach((product, index) => {
                const priceElement = product.querySelector(".price");
                const buyButton = product.querySelector(".buy");
                if (priceElement && buyButton) {
                    const salePrice = Number(buyButton.dataset.price);
                    const oldPrice = Math.ceil((salePrice * (1.55 + ((index * 13) % 35) / 100)) / 10) * 10;
                    priceElement.innerHTML = `<del class="old-price">${formatPrice(oldPrice)}</del><strong>${formatPrice(salePrice)}</strong>`;
                }
            });
        }

        function showMessage(text) {
            message.textContent = text;
            message.classList.add("show");
            setTimeout(() => message.classList.remove("show"), 1800);
        }

        function renderSavedReviews() {
            const reviews = JSON.parse(localStorage.getItem(savedReviewKey) || "[]");
            savedReviews.replaceChildren();
            reviews.forEach((review, index) => {
                const card = document.createElement("article");
                card.className = "review-card saved-review-card";
                card.dataset.reviewId = review.id || `saved-review-${index}`;

                const stars = document.createElement("div");
                stars.className = "stars";
                stars.setAttribute("aria-label", `${review.rating} stele`);
                stars.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

                const text = document.createElement("p");
                text.textContent = `„${review.text}”`;

                const name = document.createElement("strong");
                name.textContent = review.name;

                card.append(stars, text, name);
                savedReviews.appendChild(card);
                addReplyControls(card);
            });
        }

        function renderReplies(card) {
            const replies = JSON.parse(localStorage.getItem(savedReplyKey) || "{}")[card.dataset.reviewId] || [];
            const repliesArea = card.querySelector(".replies-area");
            repliesArea.replaceChildren();
            replies.forEach(reply => {
                const replyElement = document.createElement("p");
                replyElement.className = "reply-text";
                replyElement.textContent = `Răspuns: ${reply}`;
                repliesArea.appendChild(replyElement);
            });
        }

        function addReplyControls(card) {
            if (card.querySelector(".reply-button")) return;
            const replyButton = document.createElement("button");
            replyButton.className = "reply-button";
            replyButton.type = "button";
            replyButton.textContent = "Răspunde";

            const replyForm = document.createElement("form");
            replyForm.className = "reply-form";
            replyForm.hidden = true;
            replyForm.innerHTML = '<input type="text" maxlength="180" placeholder="Scrie un răspuns..." required><button type="submit">Trimite</button>';

            const repliesArea = document.createElement("div");
            repliesArea.className = "replies-area";
            card.append(replyButton, replyForm, repliesArea);
            renderReplies(card);
        }

        function renderCart() {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartNumber.textContent = totalItems;
            cartTotal.textContent = formatBothCurrencies(totalPrice);
            checkoutButton.disabled = cart.length === 0;

            if (!cart.length) {
                cartItems.innerHTML = '<p class="empty-cart">Coșul tău este gol.</p>';
                return;
            }

            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <h3>${item.name}</h3>
                        <p>${item.category} · ${formatPrice(item.price)} / buc.</p>
                    </div>
                    <div class="item-actions">
                        <button type="button" data-action="decrease" data-index="${index}" aria-label="Scade cantitatea pentru ${item.name}">−</button>
                        <select class="quantity-select" data-action="quantity" data-index="${index}" aria-label="Alege cantitatea pentru ${item.name}">
                            ${Array.from({ length: 100 }, (_, quantityIndex) => `<option value="${quantityIndex + 1}" ${item.quantity === quantityIndex + 1 ? "selected" : ""}>${quantityIndex + 1}</option>`).join("")}
                        </select>
                        <button type="button" data-action="increase" data-index="${index}" aria-label="Mărește cantitatea pentru ${item.name}">+</button>
                        <button class="delete-item" type="button" data-action="delete" data-index="${index}" aria-label="Șterge ${item.name}">×</button>
                    </div>
                </div>
            `).join("");
        }

        function setCartOpen(isOpen) {
            cartPanel.classList.toggle("open", isOpen);
            cartPanel.setAttribute("aria-hidden", String(!isOpen));
        }

        buttons.forEach(button => button.addEventListener("click", () => {
            const existingItem = cart.find(item => item.name === button.dataset.name);
            if (existingItem) {
                existingItem.quantity = Math.min(existingItem.quantity + 1, 100);
            } else {
                cart.push({
                    name: button.dataset.name,
                    category: button.dataset.category,
                    price: Number(button.dataset.price),
                    quantity: 1
                });
            }
            renderCart();
            showMessage("Adăugat în coș ✨");
        }));

        filterButtons.forEach(filterButton => filterButton.addEventListener("click", () => {
            const selectedType = filterButton.dataset.filter;
            filterButtons.forEach(button => button.classList.toggle("active", button === filterButton));
            products.forEach(product => {
                product.hidden = selectedType !== "all" && product.dataset.type !== selectedType;
            });
        }));

        cartItems.addEventListener("click", event => {
            const actionButton = event.target.closest("button[data-action]");
            if (!actionButton) return;
            const item = cart[Number(actionButton.dataset.index)];
            if (actionButton.dataset.action === "increase") item.quantity = Math.min(item.quantity + 1, 100);
            if (actionButton.dataset.action === "decrease") item.quantity -= 1;
            if (actionButton.dataset.action === "delete" || item.quantity < 1) cart.splice(Number(actionButton.dataset.index), 1);
            renderCart();
        });

        cartItems.addEventListener("change", event => {
            const quantitySelect = event.target.closest('select[data-action="quantity"]');
            if (!quantitySelect) return;
            cart[Number(quantitySelect.dataset.index)].quantity = Number(quantitySelect.value);
            renderCart();
        });

        currencySelects.forEach(currencySelect => currencySelect.addEventListener("change", () => {
            currency = currencySelect.value;
            currencySelects.forEach(select => select.value = currency);
            updateProductPrices();
            renderCart();
        }));

        function renderOrderSummary() {
            orderSummaryItems.innerHTML = cart.map(item => `<p>${item.quantity} × ${item.name} <span>${formatPrice(item.price * item.quantity)}</span></p>`).join("");
            const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            orderSummaryTotal.textContent = `Total: ${formatBothCurrencies(totalPrice)}`;
        }

        cartButton.addEventListener("click", () => setCartOpen(true));
        closeCart.addEventListener("click", () => setCartOpen(false));
        checkoutButton.addEventListener("click", () => {
            formError.textContent = "";
            renderOrderSummary();
            checkoutModal.classList.add("show");
            checkoutModal.setAttribute("aria-hidden", "false");
        });
        closeCheckout.addEventListener("click", () => {
            checkoutModal.classList.remove("show");
            checkoutModal.setAttribute("aria-hidden", "true");
        });

        checkoutForm.addEventListener("submit", event => {
            event.preventDefault();
            const email = document.getElementById("checkoutEmail").value.trim().toLowerCase();
            if (!registeredEmails.includes(email)) {
                formError.textContent = "Această adresă de email nu este corectă sau nu este înregistrată.";
                return;
            }
            checkoutModal.classList.remove("show");
            checkoutModal.setAttribute("aria-hidden", "true");
            setCartOpen(false);
            cart.length = 0;
            renderCart();
            checkoutForm.reset();
            showMessage("Îți mulțumim pentru achiziția parfumului ✨");
        });

        reviewForm.addEventListener("submit", event => {
            event.preventDefault();
            reviewFormError.textContent = "";
            const reviewName = document.getElementById("reviewName").value.trim();
            const reviewText = document.getElementById("reviewText").value.trim();
            const reviewRating = Number(document.getElementById("reviewRating").value);
            const containsBlockedWord = blockedWords.some(word => `${reviewName} ${reviewText}`.toLowerCase().includes(word));
            if (containsBlockedWord) {
                reviewFormError.textContent = "Comentariul nu poate fi publicat deoarece conține cuvinte jignitoare.";
                return;
            }
            const reviews = JSON.parse(localStorage.getItem(savedReviewKey) || "[]");
            reviews.push({
                id: `saved-review-${Date.now()}`,
                name: reviewName,
                rating: reviewRating,
                text: reviewText
            });
            localStorage.setItem(savedReviewKey, JSON.stringify(reviews));
            reviewForm.reset();
            renderSavedReviews();
            showMessage("Comentariul tău a fost publicat ✨");

            const subject = encodeURIComponent(`Comentariu nou pentru Magazinul Vectora - ${reviewName}`);
            const body = encodeURIComponent(`Nume: ${reviewName}\nRating: ${reviewRating} stele\nComentariu: ${reviewText}`);
            window.location.href = `mailto:${commentRecipient}?subject=${subject}&body=${body}`;
        });

        reviewsSection.addEventListener("click", event => {
            const replyButton = event.target.closest(".reply-button");
            if (!replyButton) return;
            const card = replyButton.closest(".review-card");
            card.querySelector(".reply-form").hidden = !card.querySelector(".reply-form").hidden;
        });

        reviewsSection.addEventListener("submit", event => {
            const replyForm = event.target.closest(".reply-form");
            if (!replyForm) return;
            event.preventDefault();
            const card = replyForm.closest(".review-card");
            const replyInput = replyForm.querySelector("input");
            const replies = JSON.parse(localStorage.getItem(savedReplyKey) || "{}");
            replies[card.dataset.reviewId] = [...(replies[card.dataset.reviewId] || []), replyInput.value.trim()];
            localStorage.setItem(savedReplyKey, JSON.stringify(replies));
            replyForm.reset();
            replyForm.hidden = true;
            renderReplies(card);
        });

        updateProductPrices();
        renderCart();
        document.querySelectorAll(".review-card").forEach(addReplyControls);
        renderSavedReviews();

        const assistantLauncher = document.getElementById("assistantLauncher");
        const assistantPanel = document.getElementById("assistantPanel");
        const assistantClose = document.getElementById("assistantClose");
        const assistantNewChat = document.getElementById("assistantNewChat");
        const assistantMessages = document.getElementById("assistantMessages");
        const assistantForm = document.getElementById("assistantForm");
        const assistantInput = document.getElementById("assistantInput");
        const assistantPrompts = document.getElementById("assistantPrompts");
        let quizStep = 0;

        function toggleAssistant(isOpen) {
            assistantPanel.classList.toggle("open", isOpen);
            assistantPanel.setAttribute("aria-hidden", String(!isOpen));
            assistantLauncher.setAttribute("aria-expanded", String(isOpen));
            if (isOpen) assistantInput.focus();
        }

        function addAssistantMessage(text, type = "ai", product = null) {
            const messageElement = document.createElement("article");
            messageElement.className = `assistant-message assistant-message-${type}`;
            if (type === "ai") {
                const label = document.createElement("span");
                label.className = "assistant-message-label";
                label.textContent = "VECTOR";
                messageElement.appendChild(label);
            }
            const paragraph = document.createElement("p");
            paragraph.textContent = text;
            messageElement.appendChild(paragraph);

            if (product) {
                const productElement = document.createElement("div");
                productElement.className = "assistant-product";
                productElement.innerHTML = `<img src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><small>${formatPrice(product.price)} • ${product.category}</small></div><button class="assistant-add" type="button" data-product="${product.name}">Adaugă</button>`;
                messageElement.appendChild(productElement);
            }

            assistantMessages.appendChild(messageElement);
            assistantMessages.scrollTop = assistantMessages.scrollHeight;
        }

        function showAssistantTyping() {
            const typingElement = document.createElement("div");
            typingElement.className = "assistant-typing";
            typingElement.innerHTML = "<span></span><span></span><span></span>";
            assistantMessages.appendChild(typingElement);
            assistantMessages.scrollTop = assistantMessages.scrollHeight;
            return typingElement;
        }

        function getCatalog() {
            return [...buttons].map(button => ({
                name: button.dataset.name,
                category: button.dataset.category,
                price: Number(button.dataset.price),
                image: button.closest(".product")?.querySelector("img")?.src || ""
            }));
        }

        function findRecommendation(query) {
            const catalog = getCatalog();
            const normalizedQuery = query.toLowerCase();
            const budgetMatch = normalizedQuery.match(/(?:sub|până la| pana la)\s*(\d{3,4})/);
            const budget = budgetMatch ? Number(budgetMatch[1]) : Infinity;
            let candidates = catalog.filter(product => product.price <= budget);
            if (!candidates.length) candidates = catalog;

            if (normalizedQuery.includes("trandafir") || normalizedQuery.includes("romantic") || normalizedQuery.includes("floral")) {
                return candidates.find(product => /rose|velvet|amber|bloom/i.test(product.name)) || candidates[0];
            }
            if (normalizedQuery.includes("oud") || normalizedQuery.includes("intens") || normalizedQuery.includes("puternic") || normalizedQuery.includes("masculin")) {
                return candidates.find(product => /oud|knight|noir|storm/i.test(product.name)) || candidates[0];
            }
            if (normalizedQuery.includes("fresh") || normalizedQuery.includes("vară") || normalizedQuery.includes("zi")) {
                return candidates.find(product => /sun|golden|stronger/i.test(product.name)) || candidates[0];
            }
            if (normalizedQuery.includes("seară") || normalizedQuery.includes("elegant") || normalizedQuery.includes("lux")) {
                return candidates.find(product => /midnight|royal|noir|prestige/i.test(product.name)) || candidates[0];
            }
            return candidates.sort((first, second) => second.price - first.price)[0];
        }

        function replyToAssistant(rawText) {
            const text = rawText.trim();
            if (!text) return;
            addAssistantMessage(text, "user");
            const normalizedText = text.toLowerCase();
            let reply = "Pot să-ți găsesc o aromă după vibe, ocazie, buget sau familie olfactivă. Încearcă: «ceva fresh pentru zi» sau «un cadou sub 1700 MDL».";
            let product = null;

            if (quizStep > 0) {
                product = findRecommendation(normalizedText);
                reply = quizStep === 1
                    ? "Perfect. Ai ales o direcție clară. Pentru personalitatea asta, aș începe cu:"
                    : "Alegerea ta are prezență. Iată match-ul meu pentru tine:";
                quizStep = 0;
            } else if (normalizedText.includes("quiz") || normalizedText.includes("test")) {
                quizStep = 1;
                reply = "Începem. Ce te reprezintă mai mult: fresh și luminos, dulce și magnetic sau intens și misterios? Scrie una dintre cele trei direcții.";
            } else if (normalizedText.includes("livrar") || normalizedText.includes("comand")) {
                reply = "Livrarea este rapidă și sigură în toată Moldova. Pentru comandă, adaugă parfumul în coș, apoi apasă «Cumpără acum» și completează datele de contact.";
            } else if (normalizedText.includes("coș") || normalizedText.includes("cos") || normalizedText.includes("preț") || normalizedText.includes("pret")) {
                reply = "Te pot ajuta să alegi după buget. Avem parfumuri de la 1.350 MDL, iar moneda se poate schimba în MDL sau EUR din magazin.";
            } else if (normalizedText.includes("cadou") || normalizedText.includes("fresh") || normalizedText.includes("trandafir") || normalizedText.includes("romantic") || normalizedText.includes("oud") || normalizedText.includes("intens") || normalizedText.includes("seară") || normalizedText.includes("elegant") || normalizedText.includes("vară")) {
                product = findRecommendation(normalizedText);
                reply = `Am citit vibe-ul. ${product.name} mi se pare alegerea potrivită pentru ce ai descris:`;
            } else if (normalizedText.includes("mulțum") || normalizedText.includes("mersi")) {
                reply = "Cu plăcere. Aroma potrivită nu se caută la întâmplare, se recunoaște.";
            }

            const typingElement = showAssistantTyping();
            window.setTimeout(() => {
                typingElement.remove();
                addAssistantMessage(reply, "ai", product);
            }, 520);
        }

        assistantLauncher.addEventListener("click", () => toggleAssistant(!assistantPanel.classList.contains("open")));
        assistantClose.addEventListener("click", () => toggleAssistant(false));
        assistantNewChat.addEventListener("click", () => {
            quizStep = 0;
            assistantMessages.replaceChildren();
            addAssistantMessage("Conversație nouă. Sunt gata să-ți găsesc aroma potrivită. Spune-mi ocazia, bugetul sau starea pe care vrei să o transmiți.");
            assistantInput.focus();
        });
        assistantForm.addEventListener("submit", event => {
            event.preventDefault();
            const text = assistantInput.value;
            assistantInput.value = "";
            replyToAssistant(text);
        });
        assistantPrompts.addEventListener("click", event => {
            const promptButton = event.target.closest("button[data-prompt]");
            if (!promptButton) return;
            replyToAssistant(promptButton.dataset.prompt);
        });
        assistantMessages.addEventListener("click", event => {
            const addButton = event.target.closest(".assistant-add");
            if (!addButton) return;
            const matchingButton = [...buttons].find(button => button.dataset.name === addButton.dataset.product);
            if (matchingButton) {
                matchingButton.click();
                addButton.textContent = "Adăugat";
                addButton.disabled = true;
            }
        });

    