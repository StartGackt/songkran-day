const quotes = [
  "หยดน้ำที่รดลงมา ขอให้พัดพาความเหนื่อยล้าออกไป แล้วแทนที่ด้วยความสดใสเริ่มต้นใหม่ในทุกๆ วัน",
  "คุณเก่งมากแล้วที่ผ่านปีที่วุ่นวายมาได้ สงกรานต์นี้พักใจให้เต็มที่ แล้วกลับมายิ้มให้กว้างกว่าเดิม",
  "รอยยิ้มของคุณคือสิ่งที่มีค่าที่สุด อย่าลืมมอบมันให้กับตัวเองในกระจกทุกเช้านะ",
  "ไม่ว่าปีที่ผ่านมาจะเจออะไรมาบ้าง ขอให้หยดน้ำสงกรานต์นี้ ช่วยเยียวยาและเติมเต็มกำลังใจให้คุณนะ",
  "สุขสันต์วันสงกรานต์ ขอให้ความสุขหลั่งไหลมาดั่งสายน้ำ เย็นฉ่ำชื่นใจตลอดปี",
];

const initialComments = [
  "สวัสดีปีใหม่ไทยครับทุกคน รวยๆ เฮงๆ นะ 💦",
  "ขอให้ทุกคนสุขภาพแข็งแรงครับ 💛",
];

document.addEventListener('DOMContentLoaded', () => {
  const btnSplash = document.getElementById('btn-splash');
  const btnQuote = document.getElementById('btn-quote');
  const quoteCard = document.getElementById('quote-card');
  const quoteText = document.getElementById('quote-text');
  
  const commentForm = document.getElementById('comment-form') as HTMLFormElement;
  const commentInput = document.getElementById('comment-input') as HTMLInputElement;
  const commentsList = document.getElementById('comments-list');

  // Random Quote logic
  btnQuote?.addEventListener('click', () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    if (quoteText) quoteText.textContent = `"${randomQuote}"`;
    
    if (quoteCard) {
      if (quoteCard.classList.contains('hidden')) {
        quoteCard.classList.remove('hidden');
      }
      
      quoteCard.classList.remove('animating');
      // Trigger reflow
      void quoteCard.offsetWidth;
      quoteCard.classList.add('animating');
    }
  });

  // Water Splash logic
  btnSplash?.addEventListener('click', (e) => {
    createSplashEffect(e as MouseEvent);
    playSplashSound();
  });

  // Render initial comments
  initialComments.forEach(comment => addCommentToDOM(comment));

  // Comment Form logic
  commentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = commentInput.value.trim();
    if (val) {
      addCommentToDOM(val, true);
      commentInput.value = '';
    }
  });

  function addCommentToDOM(text: string, isNew = false) {
    if (!commentsList) return;
    const li = document.createElement('li');
    li.className = 'comment-item';
    li.textContent = text;
    if (isNew) {
      commentsList.prepend(li);
    } else {
      commentsList.appendChild(li);
    }
  }

  function createSplashEffect(e: MouseEvent) {
    const container = document.getElementById('splash-container');
    if (!container) return;

    const numDrops = 20;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    for (let i = 0; i < numDrops; i++) {
      const drop = document.createElement('div');
      drop.className = 'water-drop';
      
      const size = Math.random() * 20 + 10;
      drop.style.width = `${size}px`;
      drop.style.height = `${size}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 200 + 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      
      drop.style.left = `${x}px`;
      drop.style.top = `${y}px`;
      drop.style.setProperty('--tx', `${tx}px`);
      drop.style.setProperty('--ty', `${ty}px`);
      
      container.appendChild(drop);
      
      setTimeout(() => {
        drop.remove();
      }, 600);
    }
  }

  function playSplashSound() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch(e) {
      console.log('Audio disabled or failed');
    }
  }
});
