// ==========================================
// CONFIGURATION DU PROJET & COLLECTION DE LETTRES
// ==========================================
const CONFIG = {
    prenom: "Fédora"
};

// Collection des 7 Lettres
const LETTRES = [
    {
        id: 1,
        numero: "01",
        titre: "Lettre 01 — Pour te faire sourire",
        subtext: "Une touche de légèreté",
        contenu: [
            "Je voulais commencer cette collection par quelque chose de simple et mignon. Je me surprends souvent à sourire en pensant à nos échanges ou à la façon dont tu réagis quand je t'embête un peu.",
            "Je voulais faire un début hyper sérieux... mais avec toi, j'ai rapidement compris que j'allais encore finir par faire un peu de rizz."
        ]
    },
    {
        id: 2,
        numero: "02",
        titre: "Lettre 02 — Pour tes yeux",
        subtext: "Un regard inoubliable",
        contenu: [
            "S'il y a bien une chose qui attire tout de suite l'attention chez toi, c'est ton regard. Tes yeux ont ce truc particulier qui capte l'attention sans même faire d'effort.",
            "C'est l'une des premières choses que j'ai remarquées chez toi, et c'est toujours un vrai plaisir de croiser ton regard. Simple, naturel, mais impossible à ignorer."
        ]
    },
    {
        id: 3,
        numero: "03",
        titre: "Lettre 03 — Pour les petits détails",
        subtext: "Ce qui te rend unique",
        contenu: [
            "J'ai toujours remarqué à quel point tes ongles sont soignés et parfaits !",
            "Mais au-delà de ça, ce sont tous ces petits détails, ton style, ta façon d'être, qui font qu'on s'attache à une personne et qu'elle devient intéressante et unique à nos yeux."
        ]
    },
    {
        id: 4,
        numero: "04",
        titre: "Lettre 04 — Pour nos conversations",
        subtext: "Le plaisir de discuter",
        contenu: [
            "J'adore nos discussions. Que ce soit pour échanger des bêtises ou parler de choses plus sérieuses, voir une notification de toi me donne toujours le sourire.",
            "Même une journée tout à fait ordinaire devient tout de suite plus intéressante quand on trouve l'occasion de discuter ensemble."
        ]
    },
    {
        id: 5,
        numero: "05",
        titre: "Lettre 05 — Pour mes rizz",
        subtext: "Un peu d'humour",
        contenu: [
            "Comment était ma journée ? Rien de spécial… tu n'étais pas là.",
            "Tu me connais, je trouve toujours une occasion spontanée de glisser une petite phrase de rizz. Mais avoue quand même… certains étaient vraiment pas mal, non ?"
        ]
    },
    {
        id: 6,
        numero: "06",
        titre: "Lettre 06 — Pour ton anniversaire",
        subtext: "Des vœux sincères",
        contenu: [
            "Pour cette nouvelle année qui commence pour toi, je te souhaite de tout mon cœur d'être heureuse, de réussir tout ce que tu entreprends, de faire de magnifiques rencontres et de créer de précieux souvenirs.",
            "Continue d'irradier cette belle énergie et de profiter pleinement de chaque instant. Tu le mérites tellement."
        ]
    },
    {
        id: 7,
        numero: "07",
        titre: "Lettre 07 — Une dernière chose…",
        subtext: "Celle-ci est réservée pour la fin.",
        contenu: [
            "Cette dernière lettre, c'est simplement pour te dire ce qui ne rentrait pas dans les autres. Je suis sincèrement reconnaissant de t'avoir dans ma vie. Ta douceur, ta force et ton sourire rendent tout plus beau.",
            "Merci d'être toi, Fédora.",
            "Et maintenant… je crois que j'ai vraiment tout dit."
        ]
    }
];

// État de progression des lettres
let openedLettersSet = new Set();
let unlockedMaxId = 1;
let currentOpenLetter = null;

// ==========================================
// GESTION DU ROUTAGE (ÉCRANS)
// ==========================================
let screens = {};

function initScreens() {
    screens = {
        intro: document.getElementById('screen-intro'),
        provocation: document.getElementById('screen-provocation'),
        loading: document.getElementById('screen-loading'),
        polaroids: document.getElementById('screen-polaroids'),
        sincere: document.getElementById('screen-sincere'),
        countdown: document.getElementById('screen-countdown'),
        birthday: document.getElementById('screen-birthday'),
        final: document.getElementById('screen-final'),
        secretTransition: document.getElementById('screen-secret-transition'),
        collection: document.getElementById('screen-collection'),
        grandFinale: document.getElementById('screen-grand-finale')
    };
}

function showScreen(screenElement) {
    if (!screenElement) return;

    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
            screen.style.display = 'none';
        }
    });

    screenElement.style.display = 'block';
    void screenElement.offsetWidth; // Reflow
    screenElement.classList.add('active');
}

// Au chargement du DOM
window.addEventListener('DOMContentLoaded', () => {
    initScreens();

    Object.values(screens).forEach(s => {
        if (s) s.style.display = 'none';
    });
    
    if (screens.intro) {
        screens.intro.style.display = 'block';
        screens.intro.classList.add('active');
    }

    createParticles();
    initEventListeners();
    initMusicControl();
    runPreloader();
});

// ==========================================
// PRELOADER INITIAL DE DÉMARRAGE & DÉCLENCHEMENT AUDIO
// ==========================================
function runPreloader() {
    const preloader = document.getElementById('app-preloader');
    const barFill = document.getElementById('preloader-bar-fill');
    const btnEnter = document.getElementById('btn-enter-app');
    const preloaderText = document.getElementById('preloader-text');

    if (!preloader || !barFill) return;

    let dismissed = false;
    function dismissPreloader() {
        if (dismissed) return;
        dismissed = true;
        if (window.attemptAutoPlayMusic) {
            window.attemptAutoPlayMusic();
        }
        preloader.classList.add('fade-out');
    }

    // Un clic n'importe où sur l'écran de chargement ouvre l'expérience et lance la musique
    preloader.addEventListener('click', () => {
        dismissPreloader();
    });

    if (btnEnter) {
        btnEnter.addEventListener('click', (e) => {
            e.stopPropagation();
            dismissPreloader();
        });
    }

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 22) + 15;
        if (progress > 100) progress = 100;
        barFill.style.width = `${progress}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (preloaderText) preloaderText.innerText = "Tout est prêt pour toi ✨";
                if (btnEnter) btnEnter.classList.remove('hidden');
                // Tenter le lancement auto
                if (window.attemptAutoPlayMusic) {
                    window.attemptAutoPlayMusic();
                }
            }, 250);
        }
    }, 110);
}

// ==========================================
// GESTION DE LA MUSIQUE D'AMBIANCE AUTOMATIQUE
// ==========================================
let isMusicPlaying = false;

function initMusicControl() {
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');
    const musicWaves = document.getElementById('music-waves');

    if (!bgMusic || !musicToggle) return;

    bgMusic.volume = 0.35; // Volume de fond doux

    function updateMusicUI(playing) {
        isMusicPlaying = playing;
        if (playing) {
            musicToggle.classList.add('playing');
            if (musicIcon) musicIcon.classList.add('hidden');
            if (musicWaves) musicWaves.classList.remove('hidden');
        } else {
            musicToggle.classList.remove('playing');
            if (musicIcon) musicIcon.classList.remove('hidden');
            if (musicWaves) musicWaves.classList.add('hidden');
        }
    }

    function playMusic() {
        return bgMusic.play().then(() => {
            updateMusicUI(true);
        }).catch(err => {
            console.log("Autoplay restreint par le navigateur — attente du premier clic.", err);
            updateMusicUI(false);
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        updateMusicUI(false);
    }

    function toggleMusic() {
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    }

    window.attemptAutoPlayMusic = playMusic;

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusic();
    });

    // Tenter immédiatement la lecture dès le démarrage
    playMusic();

    // Déclencheur universel instantané au premier clic/toucher n'importe où
    const userInteractionEvents = ['click', 'touchstart', 'pointerdown', 'keydown'];
    const triggerAudioOnInteraction = () => {
        if (bgMusic.paused) {
            playMusic();
        }
    };

    userInteractionEvents.forEach(evt => {
        document.addEventListener(evt, triggerAudioOnInteraction);
    });
}

// ==========================================
// GESTION DES CLICS ET INTERACTIONS
// ==========================================
function initEventListeners() {
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            if (window.attemptAutoPlayMusic) window.attemptAutoPlayMusic();
            showScreen(screens.provocation);
        });
    }

    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    if (btnNo) {
        btnNo.addEventListener('click', () => {
            btnNo.classList.add('toss-away');
            btnNo.disabled = true;
            setTimeout(() => {
                btnNo.style.display = 'none';
            }, 800);
        });
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            showScreen(screens.loading);
            startFakeLoading();
        });
    }

    const btnToSincere = document.getElementById('btn-to-sincere');
    if (btnToSincere) {
        btnToSincere.addEventListener('click', () => showScreen(screens.sincere));
    }

    const btnToCountdown = document.getElementById('btn-to-countdown');
    if (btnToCountdown) {
        btnToCountdown.addEventListener('click', () => {
            showScreen(screens.countdown);
            startShortCountdown();
        });
    }

    const btnToFinal = document.getElementById('btn-to-final');
    if (btnToFinal) {
        btnToFinal.addEventListener('click', () => {
            showScreen(screens.final);
            triggerConfetti('confetti-container-final');
        });
    }

    // Bouton Fin de la grande lettre -> Fausse Fin & Transition Secrète
    const btnToSecretTransition = document.getElementById('btn-to-secret-transition');
    if (btnToSecretTransition) {
        btnToSecretTransition.addEventListener('click', () => {
            startSecretTransition();
        });
    }

    // Bouton Découvrir -> Écran Collection de Lettres
    const btnDiscoverCollection = document.getElementById('btn-discover-collection');
    if (btnDiscoverCollection) {
        btnDiscoverCollection.addEventListener('click', () => {
            showScreen(screens.collection);
            renderCollectionGrid();
        });
    }

    // Bouton Fermer la lettre
    const btnCloseLetter = document.getElementById('btn-close-letter');
    if (btnCloseLetter) {
        btnCloseLetter.addEventListener('click', () => {
            closeLetterModal();
        });
    }

    // Bouton Recommencer l'expérience
    const btnRestartExperience = document.getElementById('btn-restart-experience');
    if (btnRestartExperience) {
        btnRestartExperience.addEventListener('click', () => {
            openedLettersSet.clear();
            unlockedMaxId = 1;
            showScreen(screens.intro);
        });
    }
}

// ==========================================
// TRANSITION SECRÈTE (ÉTAPE 9)
// ==========================================
function startSecretTransition() {
    showScreen(screens.secretTransition);

    const txt1 = document.getElementById('secret-text-1');
    const txt2 = document.getElementById('secret-text-2');
    const txt3 = document.getElementById('secret-text-3');
    const btnDiscover = document.getElementById('btn-discover-collection');

    if (txt1) txt1.classList.remove('hidden');
    if (txt2) txt2.classList.add('hidden');
    if (txt3) txt3.classList.add('hidden');
    if (btnDiscover) btnDiscover.classList.add('hidden');

    setTimeout(() => {
        if (txt2) txt2.classList.remove('hidden');
    }, 900);

    setTimeout(() => {
        if (txt3) txt3.classList.remove('hidden');
        if (btnDiscover) btnDiscover.classList.remove('hidden');
    }, 1800);
}

// ==========================================
// AFFICHAGE ET GESTION DE LA COLLECTION DE LETTRES
// ==========================================
function renderCollectionGrid() {
    const grid = document.getElementById('envelopes-grid');
    const counter = document.getElementById('collection-counter');
    const progressFill = document.getElementById('progress-bar-fill');
    if (!grid) return;

    grid.innerHTML = '';

    const countRead = openedLettersSet.size;
    if (counter) counter.innerText = `${countRead} / 7 lettres découvertes`;
    if (progressFill) progressFill.style.width = `${(countRead / 7) * 100}%`;

    LETTRES.forEach(letter => {
        const isLocked = letter.id > unlockedMaxId;
        const isRead = openedLettersSet.has(letter.id);

        const card = document.createElement('div');
        card.className = `envelope-card ${isLocked ? 'locked' : (isRead ? 'read' : 'unlocked')}`;

        let statusIcon = '✉️';
        if (isLocked) statusIcon = '🔒';
        else if (isRead) statusIcon = '📖';

        card.innerHTML = `
            <div class="envelope-header">
                <span class="env-num">LETTRE ${letter.numero}</span>
                <span class="env-status">${statusIcon}</span>
            </div>
            <div class="env-title">${isLocked ? 'Lettre ' + letter.numero : letter.titre}</div>
            <div class="env-subtext">${isLocked ? '🔒 ' + letter.subtext : (isRead ? 'Déjà lue' : 'Cliquer pour ouvrir')}</div>
        `;

        if (!isLocked) {
            card.addEventListener('click', () => {
                openLetterModal(letter);
            });
        }

        grid.appendChild(card);
    });
}

function openLetterModal(letter) {
    currentOpenLetter = letter;
    const modal = document.getElementById('letter-modal');
    const numSpan = document.getElementById('modal-letter-num');
    const titleH3 = document.getElementById('modal-letter-title');
    const bodyText = document.getElementById('modal-letter-body');

    if (!modal) return;

    if (numSpan) numSpan.innerText = `Lettre ${letter.numero}`;
    if (titleH3) titleH3.innerText = letter.titre;

    if (bodyText) {
        bodyText.innerHTML = '';
        letter.contenu.forEach(paragraph => {
            const p = document.createElement('p');
            p.innerText = paragraph;
            bodyText.appendChild(p);
        });
    }

    modal.classList.remove('hidden');
}

function closeLetterModal() {
    const modal = document.getElementById('letter-modal');
    if (modal) modal.classList.add('hidden');

    if (currentOpenLetter) {
        const letterId = currentOpenLetter.id;
        openedLettersSet.add(letterId);

        // Déverrouillage de la suivante
        if (letterId < 7 && unlockedMaxId <= letterId) {
            unlockedMaxId = letterId + 1;
            if (unlockedMaxId === 7) {
                const toast = document.getElementById('unlock-toast');
                if (toast) {
                    toast.classList.remove('hidden');
                    setTimeout(() => toast.classList.add('hidden'), 4000);
                }
            }
        }

        renderCollectionGrid();

        // Si c'est la 7ème lettre qu'on ferme -> Grand Finale !
        if (letterId === 7) {
            setTimeout(() => {
                startGrandFinale();
            }, 600);
        }
    }
}

// ==========================================
// GRAND FINALE (APRÈS LA 7ÈME LETTRE)
// ==========================================
function startGrandFinale() {
    showScreen(screens.grandFinale);

    const msg1 = document.getElementById('finale-msg-1');
    const msg2 = document.getElementById('finale-msg-2');
    const msg3 = document.getElementById('finale-msg-3');
    const msg4 = document.getElementById('finale-msg-4');
    const btnRestart = document.getElementById('btn-restart-experience');

    if (msg1) msg1.classList.remove('hidden');
    if (msg2) msg2.classList.add('hidden');
    if (msg3) msg3.classList.add('hidden');
    if (msg4) msg4.classList.add('hidden');
    if (btnRestart) btnRestart.classList.add('hidden');

    setTimeout(() => {
        if (msg2) msg2.classList.remove('hidden');
    }, 1000);

    setTimeout(() => {
        if (msg3) msg3.classList.remove('hidden');
        if (msg4) msg4.classList.remove('hidden');
        triggerConfetti('confetti-container-finale');
    }, 2000);

    setTimeout(() => {
        if (btnRestart) btnRestart.classList.remove('hidden');
    }, 2800);
}

// ==========================================
// LOGIQUE DU FAUX CHARGEMENT
// ==========================================
function startFakeLoading() {
    const termBody = document.getElementById('terminal-text');
    if (!termBody) return;
    termBody.innerHTML = '';

    const lines = [
        "Initiation du protocole 'Choses Sérieuses'...",
        "Scan en cours : 100% - Niveau de charme détecté : Critique.",
        "Analyse de la perfection des ongles... Résultat : Inégalable.",
        "Connexion sécurisée établie avec le cœur de Fédora.",
        "Redirection en cours..."
    ];

    let delay = 0;
    lines.forEach((line) => {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'terminal-line';
            p.innerText = `> ${line}`;
            termBody.appendChild(p);
            termBody.scrollTop = termBody.scrollHeight;
        }, delay);
        delay += 900;
    });

    setTimeout(() => {
        showScreen(screens.polaroids);
    }, delay + 800);
}

// ==========================================
// LOGIQUE DU COMPTE À REBOURS SHORT
// ==========================================
function startShortCountdown() {
    let count = 3;
    const cdNumber = document.getElementById('short-cd-number');
    if (!cdNumber) return;
    
    cdNumber.style.animation = 'none';
    void cdNumber.offsetWidth;
    cdNumber.style.animation = 'popIn 1s infinite';
    
    cdNumber.innerText = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            cdNumber.innerText = count;
        } else {
            clearInterval(interval);
            showScreen(screens.birthday);
            triggerConfetti();
        }
    }, 1000);
}

// ==========================================
// EFFETS VISUELS (PARTICULES ET CONFETTIS NEUTRES)
// ==========================================
function createParticles() {
    // Suppression des éléments tombants
}

function triggerConfetti(containerId = 'confetti-container') {
    let container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#ffd700', '#ff007f', '#a855f7', '#ff77a9', '#00f0ff', '#ffffff', '#d8c2e2', '#e6d5f2'];
    const confettiCount = 145;
    const pieces = [];

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.42;

    for (let i = 0; i < confettiCount; i++) {
        const el = document.createElement('div');
        el.className = 'burst-confetti';

        const size = Math.random() * 8 + 6; // 6px à 14px
        const isCircle = Math.random() > 0.4;
        const isRibbon = Math.random() > 0.7;

        let w = size;
        let h = isRibbon ? size * 2.4 : (isCircle ? size : size * 1.2);

        el.style.width = `${w}px`;
        el.style.height = `${h}px`;
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = isCircle ? '50%' : '2px';
        el.style.left = `${centerX}px`;
        el.style.top = `${centerY}px`;

        container.appendChild(el);

        // Explosion à 360° avec impulsion vers le haut
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 22 + 12;

        pieces.push({
            el: el,
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (Math.random() * 10 + 7), // Tir vers le haut
            rotX: Math.random() * 360,
            rotY: Math.random() * 360,
            rotZ: Math.random() * 360,
            vRotX: (Math.random() - 0.5) * 22,
            vRotY: (Math.random() - 0.5) * 22,
            vRotZ: (Math.random() - 0.5) * 22,
            opacity: 1,
            gravity: 0.55 + Math.random() * 0.22,
            drag: 0.95 + Math.random() * 0.02
        });
    }

    let startTime = null;
    function animateConfetti(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        let aliveCount = 0;

        pieces.forEach(p => {
            if (p.opacity <= 0) return;
            aliveCount++;

            p.vx *= p.drag;
            p.vy *= p.drag;
            p.vy += p.gravity;

            p.x += p.vx;
            p.y += p.vy;

            p.rotX += p.vRotX;
            p.rotY += p.vRotY;
            p.rotZ += p.vRotZ;

            if (elapsed > 2400) {
                p.opacity -= 0.015;
            }

            if (p.opacity < 0) p.opacity = 0;

            p.el.style.transform = `translate3d(${p.x - centerX}px, ${p.y - centerY}px, 0px) rotateX(${p.rotX}deg) rotateY(${p.rotY}deg) rotateZ(${p.rotZ}deg)`;
            p.el.style.opacity = p.opacity;
        });

        if (aliveCount > 0 && elapsed < 5500) {
            requestAnimationFrame(animateConfetti);
        } else {
            container.innerHTML = '';
        }
    }

    requestAnimationFrame(animateConfetti);
}
