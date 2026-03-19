// app/utils/speech.ts
/**
 * 朗读指定文本
 * @param text 要朗读的文本
 * @param lang 语言代码，默认英语 'en-US'（中文用 'zh-CN'）
 */
export function speak(text: string, lang: string = 'en-US') {
  // 检查浏览器是否支持语音合成
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音播放功能，请更换现代浏览器（Chrome、Edge、Safari）。');
    return;
  }

  // 取消任何正在播放的语音，避免重叠
  window.speechSynthesis.cancel();

  // 创建语音对象
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;      // 设置语言
  utterance.rate = 0.9;       // 语速（0.1~10），0.9 稍慢，适合学习
  utterance.pitch = 1;        // 音高（0~2）
  utterance.volume = 1;       // 音量（0~1）

  // 可选：获取可用的声音列表，并选择某个特定声音（如 Google 普通话）
  // 如果需要，可以取消下面的注释来查看所有声音
  /*
  window.speechSynthesis.onvoiceschanged = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log(voices);
    // 例如选择中文声音：const zhVoice = voices.find(v => v.lang === 'zh-CN');
    // if (zhVoice) utterance.voice = zhVoice;
  };
  */

  // 播放
  window.speechSynthesis.speak(utterance);
}