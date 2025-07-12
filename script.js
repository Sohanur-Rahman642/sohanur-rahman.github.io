document.addEventListener('DOMContentLoaded', function() {
            // --- Logo typing animation ---
            const logoElement = document.getElementById('logo');
            const logoText = '<Sohan/>';
            let i = 0;

            function typeLogo() {
                if (i < logoText.length) {
                    logoElement.innerHTML += logoText.charAt(i);
                    i++;
                    setTimeout(typeLogo, 150);
                }
            }

            // Start the typing animation
            if (logoElement) {
                logoElement.classList.add('typing-cursor');
                typeLogo();
            }

            // --- Original page script ---
            const header = document.getElementById('header');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('bg-opacity-90', 'shadow-lg');
                } else {
                    header.classList.remove('bg-opacity-90', 'shadow-lg');
                }
            });

            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });

            const sections = document.querySelectorAll('.fade-in-section');
            const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            sections.forEach(section => observer.observe(section));

            // --- Section Title Highlighting on Nav Click ---
            const navLinks = document.querySelectorAll('.nav-link');

            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const targetTitle = targetSection.querySelector('h2');
                        if (targetTitle) {
                            targetTitle.classList.add('title-highlight');
                            setTimeout(() => {
                                targetTitle.classList.remove('title-highlight');
                            }, 1200);
                        }
                    }
                });
            });


            // --- Timeline Circle Highlight on Card Hover ---
            const timelineEntries = document.querySelectorAll('.timeline-entry');

            timelineEntries.forEach(entry => {
                const card = entry.querySelector('.glass-card');
                const circle = entry.querySelector('.timeline-circle');

                if (card && circle) {
                    card.addEventListener('mouseenter', () => {
                        circle.classList.add('timeline-circle-highlight');
                    });

                    card.addEventListener('mouseleave', () => {
                        circle.classList.remove('timeline-circle-highlight');
                    });
                }
            });


            // --- Gemini AI Modal Script ---
            const aiModal = document.getElementById('ai-modal');
            const modalOverlay = document.getElementById('modal-overlay');
            const modalContainer = document.getElementById('modal-container');
            const openModalButton = document.getElementById('open-ai-modal-button');
            const closeModalButton = document.getElementById('close-ai-modal-button');
            const analyzeButton = document.getElementById('analyze-button');
            const jobDescriptionInput = document.getElementById('job-description-input');
            const resultContainer = document.getElementById('result-container');
            const resultTitle = document.getElementById('result-title');
            const scoreLine = document.getElementById('score-line');
            const matchReasonsEl = document.getElementById('match-reasons');
            const loaderContainer = document.getElementById('loader-container');
            const errorContainer = document.getElementById('error-container');

            const resetModal = () => {
                jobDescriptionInput.value = '';
                resultContainer.classList.add('hidden');
                errorContainer.classList.add('hidden');
                loaderContainer.classList.add('hidden');
                analyzeButton.disabled = false;
                // Remove potential subtitle if it exists
                const existingSubtitle = resultContainer.querySelector('.subtitle');
                if (existingSubtitle) {
                    existingSubtitle.remove();
                }
            };

            const openModal = () => {
                aiModal.classList.remove('hidden');
                setTimeout(() => {
                    modalOverlay.classList.remove('opacity-0');
                    modalContainer.classList.remove('opacity-0', 'scale-95');
                }, 10);
            };

            const closeModal = () => {
                modalOverlay.classList.add('opacity-0');
                modalContainer.classList.add('opacity-0', 'scale-95');
                setTimeout(() => {
                    aiModal.classList.add('hidden');
                    resetModal();
                }, 300);
            };

            openModalButton.addEventListener('click', openModal);
            closeModalButton.addEventListener('click', closeModal);
            modalOverlay.addEventListener('click', closeModal);

            const analyzeJobMatch = async () => {
                const jobDescription = jobDescriptionInput.value;
                if (!jobDescription.trim()) {
                    showError('Please paste a job description first.');
                    return;
                }

                analyzeButton.disabled = true;
                loaderContainer.classList.remove('hidden');
                resultContainer.classList.add('hidden');
                errorContainer.classList.add('hidden');

                const myProfile = `
                    - Name: Sohan
                    - Role: Senior Software Engineer
                    - Experience Summary: Extensive experience in Android development (Kotlin, Java, Jetpack Compose) and backend systems. Proven track record of leading teams and delivering high-performance, scalable mobile applications with millions of users (TallyKhata, Foodi). Skilled in modern architectures like MVVM and MVI, multi-device data synchronization, CI/CD, and cloud technologies.
                    - Key Skills: Kotlin, Java, Python, JavaScript, Android Studio, Jetpack Compose, React Native, Kotlin Multiplatform, MVVM, MVI, Coroutines, Flow, Room, WorkManager, Retrofit, Google Maps APIs, CI/CD, GitHub Actions, Firebase, LangChain, Gemini, Vertex AI.
                    - AI/ML Experience: Built an AI-powered FAQ system with LangChain, ChromaDB, and Gemini. Developed an AI-driven Compose Multiplatform app for expense management using Gemini and Firebase Vertex AI.
                `;

                const prompt = `
                    Act as an expert technical recruiter. Analyze the following job description and compare it against Sohan's profile.

                    **Sohan's Profile:**
                    ${myProfile}

                    **Job Description:**
                    ${jobDescription}

                    **Task:**
                    1.  Calculate a "matchPercentage" (an integer from 0 to 100).
                    2.  If the matchPercentage is 70 or higher, provide an array of "reasons" (3-5 bullet points) explaining why Sohan is a strong fit.
                    3.  If the matchPercentage is below 70, provide an array of "reasons" (2-3 bullet points) explaining the potential gaps or areas where the job requirements don't align with Sohan's profile.

                    **Your output MUST be a valid JSON object. Use this exact structure:**
                    {"matchPercentage": <number>, "reasons": ["reason 1", "reason 2", ...]}
                `;

                try {
                    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
                    const payload = { contents: chatHistory };
                    const apiKey = "AIzaSyB54GqkShHfL9ER-nxxD2mX3stHo7sCG-E"; 
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        console.log("Api error: ", response)
                        throw new Error(`API error: ${response.statusText}`);
                    }

                    const result = await response.json();
                    
                    if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
                        const rawText = result.candidates[0].content.parts[0].text;
                        const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                        const data = JSON.parse(jsonText);
                        showResult(data);
                    } else {
                        throw new Error('Unexpected response format from the API.');
                    }

                } catch (error) {
                    console.error('Gemini API call failed:', error);
                    showError('Sorry, something went wrong during the analysis. The AI response might have been malformed. Please try again.');
                } finally {
                    loaderContainer.classList.add('hidden');
                    analyzeButton.disabled = false;
                }
            };

            const showResult = (data) => {
                matchReasonsEl.innerHTML = ''; // Clear previous reasons
                const existingSubtitle = resultContainer.querySelector('.subtitle');
                if (existingSubtitle) existingSubtitle.remove();
                
                const score = data.matchPercentage;
                scoreLine.innerHTML = `Match Score: <span class="font-bold text-yellow-400">${score}%</span>`;

                if (score >= 90) {
                    resultTitle.textContent = "Sohan is the guy you need for this role!";
                    scoreLine.innerHTML += `<p class="text-sm text-gray-400 mt-1">Skip the others and just drop a text for him!</p>`;
                } else if (score >= 80) {
                    resultTitle.textContent = "Sohan is a great fit for the role.";
                } else if (score >= 70) {
                    resultTitle.textContent = "Sohan is a good fit for the role.";
                } else {
                    resultTitle.textContent = "Potential Mismatch Analysis:";
                    scoreLine.innerHTML = `Maybe Sohan is not a good fit for this role. <span class="font-bold text-yellow-400">(${score}%)</span>`;
                    const subTitle = document.createElement('p');
                    subTitle.className = 'subtitle mt-3 text-gray-400 text-sm';
                    subTitle.textContent = 'Here are the potential reasons why:';
                    matchReasonsEl.before(subTitle);
                }

                data.reasons.forEach(reason => {
                    const li = document.createElement('li');
                    li.textContent = reason;
                    matchReasonsEl.appendChild(li);
                });
                resultContainer.classList.remove('hidden');
            };

            const showError = (message) => {
                errorContainer.textContent = message;
                errorContainer.classList.remove('hidden');
            };
            
            analyzeButton.addEventListener('click', analyzeJobMatch);
        });