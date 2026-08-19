"use client";

import { ChangeEvent, ReactNode, useMemo, useRef, useState } from "react";

type Photo = { id: string; name: string; url: string };
type MissingItem = { id: string; page: number; chapter: string; question: string; detail: string };
type Answers = {
  name: string; height: string; package: string; secondName: string; secondHeight: string;
  lifePhotos: Photo[]; secondLifePhotos: Photo[];
  customFeeling: string;
  moodVitality: number; moodWeight: number; moodIntensity: number;
  moodVitalityTouched: boolean; moodWeightTouched: boolean; moodIntensityTouched: boolean;
  styleReferencePhotos: Photo[]; styleReferenceReason: string;
  subjectScale: number; subjectScaleTouched: boolean; shots: string[];
  propNotes: string; propPhotos: Photo[];
  inspirationPhotos: Photo[]; inspirationLinks: string; inspirationText: string;
  story: string;
  why: string[]; whyOther: string;
  discovery: string[]; discoveryDetail: string; discoveryOther: string;
  weather: string; weatherPlan: string; assistant: string; publicity: string;
  supplement: string; noSupplement: boolean;
};

const initialAnswers: Answers = {
  name: "", height: "", package: "", secondName: "", secondHeight: "",
  lifePhotos: [], secondLifePhotos: [], customFeeling: "",
  moodVitality: 50, moodWeight: 50, moodIntensity: 50,
  moodVitalityTouched: false, moodWeightTouched: false, moodIntensityTouched: false,
  styleReferencePhotos: [], styleReferenceReason: "", subjectScale: 50, subjectScaleTouched: false, shots: [],
  propNotes: "", propPhotos: [], inspirationPhotos: [], inspirationLinks: "", inspirationText: "", story: "",
  why: [], whyOther: "", discovery: [], discoveryDetail: "", discoveryOther: "",
  weather: "", weatherPlan: "", assistant: "", publicity: "", supplement: "", noSupplement: false,
};

const chapters = [
  "基本信息", "情绪与风格参考", "构图与道具",
  "灵感与故事", "选择原因与了解渠道", "拍摄安排与授权", "其他补充与确认",
];

const propPrompts = ["花或植物", "书、信件或日记", "伞、帽子或丝巾", "镜子或相框", "乐器", "有纪念意义的物品", "泡泡、风或纱", "已经准备好的服装"];
const whyOptions = ["喜欢整体的光线、色彩和氛围", "喜欢自然、不刻意摆拍的人物状态", "喜欢照片中的故事感和情绪表达", "喜欢场景选择和整体画面风格", "有一组或一张具体作品吸引了我", "其他"];
const discoveryOptions = ["小红书首页 · 随意刷到", "小红书搜索特定关键词", "抖音", "B站", "朋友推荐", "微信 · 朋友圈", "以前就关注过", "其他"];

function updateMulti(current: string[], value: string, max?: number) {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (max && current.length >= max) return current;
  return [...current, value];
}

function ChoiceGroup({ options, value, onChange, multiple = false, max, ordered = false, compact = false, glow = false }: {
  options: string[]; value: string | string[]; onChange: (value: string | string[]) => void;
  multiple?: boolean; max?: number; ordered?: boolean; compact?: boolean; glow?: boolean;
}) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return <div className={`choice-grid ${compact ? "compact" : ""}`}>
    {options.map((option) => {
      const selected = values.includes(option);
      const rank = ordered && selected ? values.indexOf(option) + 1 : null;
      return <button key={option} type="button" className={`choice ${glow ? "mood-choice" : ""} ${selected ? "selected" : ""}`}
        aria-pressed={selected}
        onClick={() => onChange(multiple ? updateMulti(values, option, max) : option)}>
        {rank && <b className="rank">{rank}</b>}<span>{option}</span>
      </button>;
    })}
  </div>;
}

function BipolarScale({ left, right, value, onChange, onInteract }: { left: string; right: string; value: number; onChange: (value: number) => void; onInteract: () => void }) {
  const [active, setActive] = useState(false);
  const update = (raw: string) => { onInteract(); onChange(Number(raw)); };
  return <div className="bipolar-scale">
    <div className="range-labels"><span>{left}</span><b>{value}%</b><span>{right}</span></div>
    <input className={`range ${active ? "is-dragging" : ""}`} aria-label={`${left}到${right}`} type="range" min="0" max="100" value={value}
      style={{ background: `linear-gradient(90deg,#748aa0 0%,#a5c6d9 ${value / 2}%,#efe9df 50%,#d8a98f ${(value + 100) / 2}%,#a66f62 100%)` }}
      onPointerDown={() => setActive(true)} onPointerUp={() => setActive(false)} onBlur={() => setActive(false)} onChange={(event) => update(event.target.value)} />
  </div>;
}

function CompositionScale({ value, onChange, onInteract }: { value: number; onChange: (value: number) => void; onInteract: () => void }) {
  const [active, setActive] = useState(false);
  const [boundary, setBoundary] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = (raw: string) => {
    onInteract(); const next = Number(raw); const clamped = Math.min(75, Math.max(25, next)); onChange(clamped);
    if (next < 25 || next > 75) {
      setBoundary(next < 25 ? "人物不能太小哦" : "人物不能太大哦");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setBoundary(""), 1500);
    }
  };
  return <div className={`composition-scale ${boundary ? "at-boundary" : ""}`}>
    <div className="range-labels subject-labels"><span>环境 · 0%</span><b>{value}%</b><span>人物 · 100%</span></div>
    <div className="range-stage">
      <input className={`range subject-range ${active ? "is-dragging" : ""}`} aria-label="人物在画面中的占比" type="range" min="0" max="100" value={value}
        style={{ background: `linear-gradient(90deg,#718d79 0%,#bad2bf ${value}%,#e6dfd5 ${value}%,#886e68 100%)` }}
        onPointerDown={() => setActive(true)} onPointerUp={() => setActive(false)} onBlur={() => setActive(false)} onChange={(event) => update(event.target.value)} />
      {boundary && <span className="boundary-tip" role="status">{boundary}</span>}
    </div>
    <div className="range-value">人物约占画面 {value}%，环境约占画面 {100 - value}%</div>
  </div>;
}

function PhotoUpload({ photos, onChange, max, label, required = false }: {
  photos: Photo[]; onChange: (photos: Photo[]) => void; max: number; label: string; required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const addPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, max - photos.length));
    const next = files.map((file) => ({ id: crypto.randomUUID(), name: file.name, url: URL.createObjectURL(file) }));
    onChange([...photos, ...next]);
    event.target.value = "";
  };
  const remove = (id: string) => {
    const target = photos.find((photo) => photo.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(photos.filter((photo) => photo.id !== id));
  };
  return <div>
    <input ref={inputRef} className="file-input" type="file" accept="image/*" multiple onChange={addPhotos} />
    <button type="button" className="upload-zone" onClick={() => inputRef.current?.click()}>
      <span className="upload-plus">＋</span><strong>{label}{required ? " · 必需" : ""}</strong><small>点击选择图片 · 最多 {max} 张 · 仅在本地预览</small>
    </button>
    {photos.length > 0 && <div className="photo-grid">{photos.map((photo) => <figure key={photo.id}>
      {/* eslint-disable-next-line @next/next/no-img-element */}<img src={photo.url} alt={photo.name} />
      <button type="button" aria-label={`移除 ${photo.name}`} onClick={() => remove(photo.id)}>×</button>
    </figure>)}</div>}
  </div>;
}

function Question({ id, number, title, helper, required, optional, children }: { id?: string; number: string; title: string; helper?: string; required?: boolean; optional?: boolean; children: ReactNode }) {
  return <article id={id} className="question-block">
    <div className="question-top"><span className="question-no">{number}</span>{required ? <span className="required">需要回答</span> : optional ? <span className="optional">选填</span> : null}</div>
    <h3>{title}</h3>{helper && <p className="helper">{helper}</p>}{children}
  </article>;
}

function Field({ label, value, onChange, placeholder, type = "text", suffix }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; suffix?: string }) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />{suffix && <b>{suffix}</b>}</div></label>;
}

function ResultItem({ label, children }: { label: string; children: ReactNode }) {
  return <div className="result-item"><span>{label}</span><div>{children || <em>未填写</em>}</div></div>;
}

function Tags({ values }: { values: string[] }) {
  return values.length ? <div className="result-tags">{values.map((value, index) => <i key={value}>{index + 1 <= 3 ? `${index + 1}. ` : ""}{value}</i>)}</div> : <em>未填写</em>;
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [toast, setToast] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [missingItems, setMissingItems] = useState<MissingItem[]>([]);
  const isDouble = answers.package.startsWith("双人");
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((old) => ({ ...old, [key]: value }));

  const selectedSummary = useMemo(() => ({
    package: answers.package || "未选择",
    people: isDouble ? `${answers.name || "未填写"} & ${answers.secondName || "未填写"}` : answers.name || "未填写",
  }), [answers.package, answers.name, answers.secondName, isDouble]);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const getMissingItems = () => {
    const items: MissingItem[] = [];
    const add = (id: string, pageNumber: number, question: string, detail: string) => items.push({ id, page: pageNumber, chapter: `Chapter ${pageNumber}`, question, detail });
    const basicMissing = [!answers.name && "称呼", !answers.height && "身高", !answers.package && "套餐"].filter(Boolean).join("、");
    if (basicMissing) add("q1", 1, "Q1 基本信息", `缺少：${basicMissing}`);
    if (answers.lifePhotos.length < 1 || (isDouble && answers.secondLifePhotos.length < 1)) add("q2", 1, "Q2 近期生活照", isDouble ? "请分别上传两位拍摄者的生活照" : "请至少上传一张生活照");
    if (isDouble && (!answers.secondName || !answers.secondHeight)) add("q1-second", 1, "Q1 双人信息", "缺少：第二位拍摄者的称呼或身高");
    if (!answers.moodVitalityTouched || !answers.moodWeightTouched || !answers.moodIntensityTouched) add("q3", 2, "Q3 情绪基调", "请分别调整三组情绪滑块");
    if (!answers.styleReferencePhotos.length || !answers.styleReferenceReason.trim()) add("q4", 2, "Q4 既往作品参考", "请上传一张主页作品截图并说明参考原因");
    if (!answers.subjectScaleTouched || !answers.shots.length) add("q7", 3, "Q7 人物占比偏好", "请调整人物占比并选择景别偏好");
    if (!answers.weather) add("q13", 6, "Q13 偏好的拍摄天气", "请选择一项天气偏好");
    if (!answers.weatherPlan) add("q14", 6, "Q14 天气变化时的处理偏好", "请选择一项处理偏好");
    if (!answers.assistant) add("q15", 6, "Q15 拍摄助手", "请选择是否接受拍摄助手");
    if (!answers.publicity) add("q16", 6, "Q16 照片公开授权", "请选择照片公开授权范围");
    return items;
  };
  const next = () => {
    setPage((value) => Math.min(8, value + 1)); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const previous = () => { setPage((value) => Math.max(0, value - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const jumpToMissing = (item: MissingItem) => {
    setMissingItems([]); setPage(item.page);
    window.setTimeout(() => {
      const element = document.getElementById(item.id); element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.classList.add("attention"); window.setTimeout(() => element?.classList.remove("attention"), 1800);
    }, 100);
  };

  const loadImage = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src;
  });

  const downloadPdf = async () => {
    const missing = getMissingItems();
    if (missing.length) { setMissingItems(missing); return; }
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas"); canvas.width = 1240; canvas.height = 9000;
      const ctx = canvas.getContext("2d"); if (!ctx) return;
      ctx.fillStyle = "#f7f1e8"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#e5ece2"; ctx.beginPath(); ctx.arc(1080, 130, 250, 0, Math.PI * 2); ctx.fill();
      const margin = 92; let y = 100;
      const font = '"Noto Serif SC", "Microsoft YaHei", sans-serif';
      const wrap = (text: string, maxWidth: number, size = 28) => {
        ctx.font = `${size}px ${font}`; const lines: string[] = []; let line = "";
        for (const char of text || "未填写") { const test = line + char; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = char; } else line = test; }
        if (line) lines.push(line); return lines;
      };
      const text = (content: string, x: number, maxWidth: number, size = 28, color = "#33413a", lineHeight = 44) => {
        ctx.fillStyle = color; ctx.font = `${size}px ${font}`; const lines = wrap(content, maxWidth, size); lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight)); y += lines.length * lineHeight; return lines.length;
      };
      const title = (label: string) => { y += 34; ctx.fillStyle = "#52695a"; ctx.font = `600 30px ${font}`; ctx.fillText(label, margin, y); y += 28; ctx.strokeStyle = "#cbd5ca"; ctx.beginPath(); ctx.moveTo(margin, y); ctx.lineTo(canvas.width - margin, y); ctx.stroke(); y += 44; };
      const row = (label: string, value: string | string[]) => { ctx.fillStyle = "#8a918b"; ctx.font = `22px ${font}`; ctx.fillText(label, margin, y); y += 36; text(Array.isArray(value) ? (value.length ? value.join(" · ") : "未填写") : value || "未填写", margin, canvas.width - margin * 2, 27, "#34423a", 42); y += 20; };
      const photos = async (label: string, items: Photo[]) => {
        if (!items.length) return; ctx.fillStyle = "#8a918b"; ctx.font = `22px ${font}`; ctx.fillText(label, margin, y); y += 24;
        const size = 210, gap = 18; for (let i = 0; i < items.length; i++) { try { const image = await loadImage(items[i].url); const x = margin + (i % 4) * (size + gap); const py = y + Math.floor(i / 4) * (size + gap); const ratio = Math.max(size / image.width, size / image.height); const sw = size / ratio, sh = size / ratio; ctx.save(); ctx.beginPath(); ctx.roundRect(x, py, size, size, 18); ctx.clip(); ctx.drawImage(image, (image.width - sw) / 2, (image.height - sh) / 2, sw, sh, x, py, size, size); ctx.restore(); } catch { /* ignore unreadable local image */ } }
        y += Math.ceil(items.length / 4) * (size + gap) + 20;
      };
      ctx.fillStyle = "#718774"; ctx.font = `20px Arial`; ctx.fillText("PORTRAIT SESSION · INSPIRATION NOTES", margin, y); y += 72;
      ctx.fillStyle = "#33413a"; ctx.font = `600 58px ${font}`; ctx.fillText(`${answers.name || "客片"} · 拍摄灵感档案`, margin, y); y += 54;
      ctx.fillStyle = "#7b837c"; ctx.font = `24px ${font}`; ctx.fillText("拍摄前信息与偏好记录", margin, y); y += 42;
      title("01 · 基本信息"); row("拍摄者", selectedSummary.people); row("身高", isDouble ? `${answers.height} cm · ${answers.secondHeight} cm` : `${answers.height} cm`); row("套餐", answers.package); await photos("近期生活照", [...answers.lifePhotos, ...answers.secondLifePhotos]);
      title("02 · 情绪与风格参考"); row("自定义情绪", answers.customFeeling); row("忧郁—生命力", `${answers.moodVitality}%`); row("轻盈—沉重", `${answers.moodWeight}%`); row("克制—热烈", `${answers.moodIntensity}%`); row("参考原因", answers.styleReferenceReason); await photos("主页风格参考", answers.styleReferencePhotos);
      title("03 · 构图与道具"); row("人物画面占比", `${answers.subjectScale}%`); row("景别", answers.shots); row("道具或自带物品", answers.propNotes); await photos("相关图片", answers.propPhotos);
      title("04 · 灵感与故事"); row("故事构想", answers.story); row("参考链接", answers.inspirationLinks); row("其他参考内容", answers.inspirationText); await photos("灵感图片", answers.inspirationPhotos);
      title("05 · 选择原因与了解渠道"); row("选择原因", answers.why.includes("其他") ? [...answers.why.filter((item) => item !== "其他"), answers.whyOther].filter(Boolean) : answers.why); row("了解渠道", answers.discovery.includes("其他") ? [...answers.discovery.filter((item) => item !== "其他"), answers.discoveryOther].filter(Boolean) : answers.discovery); row("搜索关键词或补充", answers.discoveryDetail);
      title("06 · 拍摄安排与授权"); row("天气偏好", answers.weather); row("天气变化时", answers.weatherPlan); row("拍摄助手", answers.assistant); row("照片公开范围", answers.publicity);
      title("07 · 其他补充"); row("补充内容", answers.noSupplement ? "没有其他补充" : answers.supplement);
      y += 34; ctx.fillStyle = "#708074"; ctx.font = `24px ${font}`; ctx.fillText("问卷填写完成，请摄影师在拍摄前确认以上信息。", margin, y); y += 70;
      const cropped = document.createElement("canvas"); cropped.width = canvas.width; cropped.height = Math.min(canvas.height, y); cropped.getContext("2d")?.drawImage(canvas, 0, 0);
      const { jsPDF } = await import("jspdf"); const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [cropped.width, cropped.height], hotfixes: ["px_scaling"] });
      pdf.addImage(cropped.toDataURL("image/jpeg", .9), "JPEG", 0, 0, cropped.width, cropped.height, undefined, "FAST");
      pdf.save(`${(answers.name || "客片").replace(/[\\/:*?\"<>|]/g, "-")}_拍摄灵感档案.pdf`);
    } catch { notify("PDF 生成遇到问题，请稍后再试"); } finally { setDownloading(false); }
  };

  if (page === 0) return <main className="site-shell"><Atmosphere /><section className="questionnaire-card cover-card"><div className="cover">
    <p className="eyebrow">PORTRAIT SESSION · BEFORE WE MEET</p>
    <div className="cover-art" aria-hidden="true"><div className="cover-halo" /><div className="film-card film-card-back"><span>MEMORY</span></div><div className="film-card film-card-front"><b>光</b><small>LIGHT · PORTRAIT</small></div><i className="spark spark-a">✦</i><i className="spark spark-b">·</i></div>
    <h1>在见面之前<br /><em>先认识此刻的你</em></h1>
    <p className="lead">很高兴这次能为你拍照。拍摄前，我想先了解你现在的样子、喜欢的画面，以及希望被记录下来的感受。</p>
    <p className="intro">这里没有标准答案，按直觉填写就好。大约需要 6–8 分钟，暂时不确定的内容可以先跳过，我们之后再一起确认。</p>
    <button className="primary" type="button" onClick={() => setPage(1)}>开始填写</button>
    <p className="privacy">所有照片与回答只在当前浏览器中整理，不会自动上传到服务器。填写完成后，请下载 PDF 并发送给摄影师。</p>
  </div></section></main>;

  if (page === 8) { const incomplete = getMissingItems(); return <main className="site-shell result-shell"><Atmosphere /><section className="questionnaire-card result-page">
    <div className="result-heading"><p className="eyebrow">PORTRAIT SESSION · FORM SUMMARY</p><h2>问卷填写完成</h2><p>{selectedSummary.people} · {selectedSummary.package}</p></div>
    <div className="result-document">
      <section><h3>01 · 基本信息</h3><ResultItem label="称呼">{selectedSummary.people}</ResultItem><ResultItem label="套餐">{answers.package}</ResultItem></section>
      <section><h3>02 · 情绪与风格参考</h3><ResultItem label="自定义情绪">{answers.customFeeling}</ResultItem><ResultItem label="三组情绪滑块">忧郁—生命力 {answers.moodVitality}%　·　轻盈—沉重 {answers.moodWeight}%　·　克制—热烈 {answers.moodIntensity}%</ResultItem><ResultItem label="风格参考原因">{answers.styleReferenceReason}</ResultItem></section>
      <section><h3>03 · 构图与道具</h3><ResultItem label="人物画面占比">{answers.subjectScale}%</ResultItem><ResultItem label="景别"><Tags values={answers.shots} /></ResultItem><ResultItem label="道具或自带物品">{answers.propNotes}</ResultItem></section>
      <section><h3>04 · 灵感与故事</h3><ResultItem label="故事构想">{answers.story}</ResultItem><ResultItem label="其他参考">{answers.inspirationText}</ResultItem></section>
      <section><h3>05 · 选择原因与渠道</h3><ResultItem label="选择原因"><Tags values={answers.why.includes("其他") ? [...answers.why.filter((item) => item !== "其他"), answers.whyOther].filter(Boolean) : answers.why} /></ResultItem><ResultItem label="了解渠道"><Tags values={answers.discovery.includes("其他") ? [...answers.discovery.filter((item) => item !== "其他"), answers.discoveryOther].filter(Boolean) : answers.discovery} /></ResultItem></section>
      <section><h3>06 · 拍摄安排与授权</h3><ResultItem label="天气">{answers.weather}</ResultItem><ResultItem label="拍摄助手">{answers.assistant}</ResultItem><ResultItem label="公开范围">{answers.publicity}</ResultItem></section>
      <section><h3>07 · 其他补充</h3><ResultItem label="补充内容">{answers.noSupplement ? "没有其他补充" : answers.supplement}</ResultItem></section>
    </div>
    {incomplete.length > 0 && <div className="incomplete-note"><b>还有 {incomplete.length} 项必答内容没有完成</b><span>你可以先查看档案，下载 PDF 前需要补充这些内容。</span></div>}
    <div className="result-actions"><button className="primary" type="button" disabled={downloading} onClick={downloadPdf}>{downloading ? "正在整理故事…" : "下载 PDF 拍摄档案"}</button><button className="secondary" type="button" onClick={() => setPage(6)}>返回修改</button></div>
    <p className="privacy">PDF 在当前设备本地生成。页面不会自动发送或保存你的回答。</p>
    {toast && <div className="toast">{toast}</div>}
    {missingItems.length > 0 && <div className="modal-backdrop" role="presentation"><section className="missing-modal" role="dialog" aria-modal="true" aria-labelledby="missing-title"><button className="modal-close" type="button" aria-label="关闭" onClick={() => setMissingItems([])}>×</button><p className="eyebrow">REQUIRED INFORMATION</p><h2 id="missing-title">还有 {missingItems.length} 项需要补充</h2><p>完成以下必答内容后，才能导出 PDF。点击任意一项可直接回到对应问题。</p><div className="missing-list">{missingItems.map((item) => <button key={item.id} type="button" onClick={() => jumpToMissing(item)}><span>{item.chapter} · {item.question}</span><small>{item.detail}</small><b>去填写 →</b></button>)}</div></section></div>}
  </section></main>; }

  return <main className="site-shell"><Atmosphere /><section className="questionnaire-card form-card">
    <header className="chapter-header"><div className="progress"><span>{String(page).padStart(2, "0")} / 07</span><span>{chapters[page - 1]}</span></div><div className="progress-line"><i style={{ width: `${page / 7 * 100}%` }} /></div><p className="eyebrow">CHAPTER {String(page).padStart(2, "0")}</p><h2>{chapters[page - 1]}</h2></header>

    {page === 1 && <>
      <Question id="q1" number="01" title="基本信息" required>
        <div className="field-row"><Field label="称呼 / 昵称" value={answers.name} onChange={(v) => set("name", v)} placeholder="例如：小夏" /><Field label="身高" value={answers.height} onChange={(v) => set("height", v)} placeholder="165" type="number" suffix="cm" /></div>
        <h4>本次所选套餐</h4><ChoiceGroup options={["单人 · ¥499", "单人 · ¥799", "双人 · ¥699", "双人 · ¥899"]} value={answers.package} onChange={(v) => set("package", v as string)} />
      </Question>
      {isDouble && <Question id="q1-second" number="01 · A" title="第二位拍摄者的信息" required><div className="field-row"><Field label="第二位的称呼 / 昵称" value={answers.secondName} onChange={(v) => set("secondName", v)} /><Field label="第二位的身高" value={answers.secondHeight} onChange={(v) => set("secondHeight", v)} type="number" suffix="cm" /></div></Question>}
      <Question id="q2" number="02" title="近期生活照" required helper="请提供能够看清当前面部状态、发型和发色的照片。不需要专门拍摄或精修，以便我进行针对性策划。">
        <PhotoUpload photos={answers.lifePhotos} onChange={(v) => set("lifePhotos", v)} max={3} required label={isDouble ? "上传第一位的近期生活照" : "上传 1–3 张近期生活照"} />
        {isDouble && <div className="spaced"><PhotoUpload photos={answers.secondLifePhotos} onChange={(v) => set("secondLifePhotos", v)} max={3} required label="上传第二位的近期生活照" /></div>}
      </Question>
    </>}

    {page === 2 && <>
      <Question id="q3" number="03" title="情绪基调" required helper="请根据直觉调整以下三组感受。停在中间表示两侧相对平衡，不需要刻意选择某一个极端。">
        <div className="scale-stack"><BipolarScale left="忧郁" right="生命力" value={answers.moodVitality} onChange={(v) => set("moodVitality", v)} onInteract={() => set("moodVitalityTouched", true)} /><BipolarScale left="轻盈" right="沉重" value={answers.moodWeight} onChange={(v) => set("moodWeight", v)} onInteract={() => set("moodWeightTouched", true)} /><BipolarScale left="克制" right="热烈" value={answers.moodIntensity} onChange={(v) => set("moodIntensity", v)} onInteract={() => set("moodIntensityTouched", true)} /></div>
        <label className="custom-field"><span>还有其他想补充的情绪吗？</span><input value={answers.customFeeling} onChange={(event) => set("customFeeling", event.target.value)} placeholder="例如：潮湿、清醒、游离……" /></label>
        {answers.customFeeling.trim() && <div className="custom-preview"><span>{answers.customFeeling.trim()}</span><button type="button" aria-label="删除自定义情绪" onClick={() => set("customFeeling", "")}>×</button></div>}
      </Question>
      <Question id="q4" number="04" title="这次拍摄，你希望参考我哪一组既往作品的感觉？" required helper="请从我的小红书主页中选择一张最接近你预期的照片，并上传截图作为参考。">
        <PhotoUpload photos={answers.styleReferencePhotos} onChange={(v) => set("styleReferencePhotos", v)} max={1} required label="上传一张主页作品截图" />
        <label className="textarea-field"><span>希望参考这张作品中的哪些部分？</span><textarea value={answers.styleReferenceReason} onChange={(event) => set("styleReferenceReason", event.target.value)} rows={5} placeholder="可以从人物状态、光线、色彩、构图、场景或整体氛围进行说明。请告诉我，希望在本次拍摄中保留或适度复现其中的哪些特点。" /></label>
      </Question>
    </>}

    {page === 3 && <>
      <Question id="q7" number="07" title="人物占比偏好" required helper="调整人物在画面中的大致占比。数值越低，环境所占比例越高；数值越高，人物越突出。">
        <CompositionScale value={answers.subjectScale} onChange={(v) => set("subjectScale", v)} onInteract={() => set("subjectScaleTouched", true)} />
        <h4>景别偏好</h4><ChoiceGroup compact options={["面部或局部特写", "半身", "全身", "人物与环境的大景", "没有特别偏好"]} value={answers.shots} onChange={(v) => set("shots", v as string[])} multiple max={3} />
      </Question>
      <Question number="08" title="拍摄道具或自带物品" optional helper="如果暂时没有明确想法，可以从下面这些方向获得一些灵感，再按自己的方式填写。">
        <div className="prompt-list" aria-label="填写提示">{propPrompts.map((item) => <span key={item}>{item}</span>)}</div>
        <label className="textarea-field"><span>内容说明</span><textarea value={answers.propNotes} onChange={(e) => set("propNotes", e.target.value)} rows={6} placeholder="例如：准备携带一本旧书和一条白色丝巾；希望在部分照片中使用，但不需要贯穿整组拍摄。" /></label>
        <PhotoUpload photos={answers.propPhotos} onChange={(v) => set("propPhotos", v)} max={6} label="上传相关图片（可选）" />
      </Question>
    </>}

    {page === 4 && <>
      <Question number="09" title="其他参考内容" optional helper="如果还有电影、书籍、音乐、文字或社交媒体内容可供参考，可以在这里补充。">
        <PhotoUpload photos={answers.inspirationPhotos} onChange={(v) => set("inspirationPhotos", v)} max={8} label="上传灵感图片（可选）" />
        <label className="textarea-field"><span>参考链接 · 每行一个</span><textarea value={answers.inspirationLinks} onChange={(e) => set("inspirationLinks", e.target.value)} rows={3} placeholder="粘贴小红书、B站、电影页面或其他链接……" /></label>
        <label className="textarea-field"><span>作品名称或补充说明</span><textarea value={answers.inspirationText} onChange={(e) => set("inspirationText", e.target.value)} rows={4} placeholder="请说明希望参考的内容，以及其中值得注意的元素。" /></label>
      </Question>
      <Question number="10" title="为这次约拍构造一个故事" optional helper={isDouble ? "每一次创作都可以从一个简单的故事设定开始。你可以设定你们之间的关系，以及希望表现的相处状态，例如《花与爱丽丝》中亲密、自然又带有复杂情绪的友谊。无需写完整剧本，人物关系、地点、事件或几个关键词都可以。" : "每一次创作都可以从一个简单的故事设定开始。你可以想象自己以怎样的身份进入画面，例如《呼啸山庄》中带有疏离感和生命力的人物，也可以只是某个在旅途中短暂停留的人。无需写完整剧本，人物身份、地点、事件或几个关键词都可以。"}>
        <label className="textarea-field"><span>故事设定</span><textarea value={answers.story} onChange={(e) => set("story", e.target.value)} rows={7} placeholder={isDouble ? "例如：两位多年未见的朋友在夏末重逢，一起沿河散步。" : "例如：一个人结束一段旅程，在傍晚的树林中短暂停留。"} /></label>
      </Question>
    </>}

    {page === 5 && <>
      <Question number="11" title="你选择我的主要原因" optional helper="这道题不会影响拍摄安排，但对我很重要。你的回答会帮助我了解大家最关注的内容，并用于后续改善作品呈现和服务方式。最多选择三个。"><ChoiceGroup options={whyOptions} value={answers.why} onChange={(v) => set("why", v as string[])} multiple max={3} />
        {answers.why.includes("其他") && <label className="custom-field conditional-field"><span>其他原因</span><input value={answers.whyOther} onChange={(event) => set("whyOther", event.target.value)} placeholder="请填写具体原因" /></label>}
      </Question>
      <Question number="12" title="你是在哪里了解到我的？" optional helper="这道题不会影响拍摄安排，但对我很重要。你的回答会帮助我了解大家通常通过什么渠道找到我，以便后续优化内容和服务。可多选。"><ChoiceGroup options={discoveryOptions} value={answers.discovery} onChange={(v) => set("discovery", v as string[])} multiple />
        {answers.discovery.includes("其他") && <label className="custom-field conditional-field"><span>其他渠道</span><input value={answers.discoveryOther} onChange={(event) => set("discoveryOther", event.target.value)} placeholder="请填写具体渠道" /></label>}
        <label className="textarea-field"><span>搜索关键词或补充说明</span><textarea value={answers.discoveryDetail} onChange={(e) => set("discoveryDetail", e.target.value)} rows={3} placeholder="如果通过搜索找到，可以填写当时使用的关键词。" /></label>
      </Question>
    </>}

    {page === 6 && <>
      <Question id="q13" number="13" title="偏好的拍摄天气" required><ChoiceGroup options={["阳光明亮 · 有明显光影", "柔和晴天 · 光线不太强", "阴天安静 · 低饱和", "小雨或雾气 · 更有电影感", "没有特别偏好"]} value={answers.weather} onChange={(v) => set("weather", v as string)} /></Question>
      <Question id="q14" number="14" title="天气变化时的处理偏好" required helper="最终是否改期会结合天气安全、场地条件和双方时间共同确认。"><ChoiceGroup options={["普通阴天也可以 · 不同天气有不同表达", "阴天可以 · 明显下雨希望协商改期", "比较期待阳光 · 无阳光希望协商改期", "由摄影师根据主题、光线和安全情况判断"]} value={answers.weatherPlan} onChange={(v) => set("weatherPlan", v as string)} /></Question>
      <Question id="q15" number="15" title="拍摄助手" required helper="拍摄当天可能有一位助手同行，协助使用吹风机、泡泡机、反光板以及记录花絮。助手可能为异性，不产生额外费用。"><ChoiceGroup options={["可以接受", "不希望有其他助手同行"]} value={answers.assistant} onChange={(v) => set("assistant", v as string)} /></Question>
      <Question id="q16" number="16" title="照片公开授权" required helper="是否授权不会影响本次拍摄和交付。"><ChoiceGroup options={["同意公开发布露脸照片，用于摄影作品展示及社交媒体", "不同意任何公开发布"]} value={answers.publicity} onChange={(v) => set("publicity", v as string)} /></Question>
    </>}

    {page === 7 && <Question number="17" title="还有其他需要我提前了解的内容吗？" optional helper="可以补充身体活动限制、对镜头的担心、希望避开的内容、照片用途，或任何前面没有覆盖的信息。">
      {!answers.noSupplement && <label className="textarea-field"><span>补充内容</span><textarea value={answers.supplement} onChange={(event) => set("supplement", event.target.value)} rows={7} placeholder="如果有任何需要提前沟通的内容，都可以写在这里。" /></label>}
      <button type="button" className={`no-supplement ${answers.noSupplement ? "selected" : ""}`} aria-pressed={answers.noSupplement} onClick={() => { set("noSupplement", !answers.noSupplement); if (!answers.noSupplement) set("supplement", ""); }}><span>{answers.noSupplement ? "✓" : "○"}</span>没有其他补充</button>
    </Question>}

    <nav className="page-actions"><button className="secondary" type="button" onClick={previous}>返回</button><button className="primary" type="button" onClick={next}>{page === 7 ? "确认并生成档案" : "继续下一章"}</button></nav>
    {toast && <div className="toast" role="status">{toast}</div>}
  </section></main>;
}

function Atmosphere() {
  return <><div className="mist mist-one" aria-hidden="true" /><div className="mist mist-two" aria-hidden="true" /><div className="stars" aria-hidden="true">✦　·　✧</div><div className="botanical botanical-left" aria-hidden="true">⌇</div><div className="botanical botanical-right" aria-hidden="true">⌇</div></>;
}
