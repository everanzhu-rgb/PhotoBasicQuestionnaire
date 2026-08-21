"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type Photo = { id: string; name: string; url: string };
type MissingItem = { id: string; page: number; chapter: string; question: string; detail: string };
type Answers = {
  name: string; height: string; package: string; secondName: string; secondHeight: string;
  lifePhotos: Photo[]; secondLifePhotos: Photo[];
  customFeeling: string[];
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
  lifePhotos: [], secondLifePhotos: [], customFeeling: [],
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

type TransitionStyle = "veil" | "ash" | "bloom" | "fracture" | "blinds" | "film";
type PortfolioImage = { src: string; title: string; cn: string; position: string; mobile: string; subject: string; transition: TransitionStyle; accent: string; glassTone: string; glassOpacity: string };

const portfolioImages: PortfolioImage[] = [
  { src: "/portfolio/05-black-veil-sky.jpg", title: "Veil in the Wind", cn: "风中的黑纱", position: "35% center", mobile: "42% center", subject: "44% center", transition: "veil", accent: "#9fc8dc", glassTone: "#d9ebf3", glassOpacity: "62%" },
  { src: "/portfolio/04-black-veil-hill.jpg", title: "A Quiet Farewell", cn: "无声的告别", position: "34% center", mobile: "49% center", subject: "48% center", transition: "ash", accent: "#c9ab8e", glassTone: "#eadfd2", glassOpacity: "64%" },
  { src: "/portfolio/01-sword-in-moss.jpg", title: "The Sleeping Rose", cn: "苔痕与沉睡玫瑰", position: "38% 48%", mobile: "50% 50%", subject: "50% 50%", transition: "fracture", accent: "#b85d78", glassTone: "#dce8df", glassOpacity: "66%" },
  { src: "/portfolio/02-reading-in-grass.jpg", title: "Rhythm of the Rain", cn: "林间阅读", position: "40% center", mobile: "51% center", subject: "56% center", transition: "bloom", accent: "#d2b86d", glassTone: "#e7efd5", glassOpacity: "64%" },
  { src: "/portfolio/06-apple-light-diptych.jpg", title: "The Apple and Light", cn: "苹果与光", position: "35% 38%", mobile: "50% 31%", subject: "50% 34%", transition: "blinds", accent: "#d4d173", glassTone: "#eef0c9", glassOpacity: "61%" },
  { src: "/portfolio/07-garden-motion.jpg", title: "Passing Through Green", cn: "穿过绿荫", position: "36% center", mobile: "50% center", subject: "50% center", transition: "film", accent: "#8fb985", glassTone: "#d8e8d3", glassOpacity: "66%" },
  { src: "/portfolio/08-rose-wall.jpg", title: "Where Roses Remember", cn: "蔷薇记得", position: "38% 40%", mobile: "50% 42%", subject: "50% 43%", transition: "bloom", accent: "#df9fb1", glassTone: "#f3dce5", glassOpacity: "60%" },
  { src: "/portfolio/09-cherry-duet.jpg", title: "Spring, Between Us", cn: "春日在我们之间", position: "38% 45%", mobile: "50% 36%", subject: "50% 42%", transition: "fracture", accent: "#dfaebd", glassTone: "#f1dce3", glassOpacity: "62%" },
  { src: "/portfolio/10-cherry-school.jpg", title: "After the Bell", cn: "放学以后", position: "38% 44%", mobile: "50% 35%", subject: "50% 42%", transition: "blinds", accent: "#c996a5", glassTone: "#ead8dd", glassOpacity: "63%" },
  { src: "/portfolio/03-tram-portrait.jpg", title: "A Day in Transit", cn: "晴日与电车", position: "40% center", mobile: "58% center", subject: "62% center", transition: "film", accent: "#d0ce75", glassTone: "#eaebcf", glassOpacity: "65%" },
];

function PortfolioBackdrop({ active, previous, quiet = false }: { active: number; previous: number; quiet?: boolean }) {
  const currentImage = portfolioImages[active];
  const previousImage = portfolioImages[previous];
  const particles = Array.from({ length: 22 }, (_, index) => index);
  return <div className={`portfolio-backdrop ${quiet ? "is-quiet" : ""}`} aria-hidden="true">
    <div className="portfolio-frame is-previous" style={{ backgroundImage: `url(${previousImage.src})`, "--desktop-position": previousImage.position, "--mobile-position": previousImage.mobile } as CSSProperties} />
    <div key={currentImage.src} className={`portfolio-frame is-current transition-${currentImage.transition}`} style={{ backgroundImage: `url(${currentImage.src})`, "--desktop-position": currentImage.position, "--mobile-position": currentImage.mobile } as CSSProperties} />
    {!quiet && <div key={`depth-${currentImage.src}`} className="portfolio-depth" style={{ backgroundImage: `url(${currentImage.src})`, "--desktop-position": currentImage.position, "--mobile-position": currentImage.mobile } as CSSProperties} />}
    {quiet && <div key={`subject-${currentImage.src}`} className="portfolio-subject" style={{ backgroundImage: `url(${currentImage.src})`, "--subject-position": currentImage.subject } as CSSProperties} />}
    <div key={`fx-${currentImage.src}`} className={`transition-particles particles-${currentImage.transition}`}>
      {particles.map((index) => <i key={index} style={{ "--particle-index": index, "--particle-x": `${(index * 37) % 101}%`, "--particle-y": `${12 + (index % 6) * 12}%`, "--particle-drift": `${(index - 11) * 2}px`, "--particle-start-x": `${(index - 11) * 4}px`, "--particle-start-y": `${(index % 5) * -12}px`, "--particle-delay": `${(index % 8) * 48}ms` } as CSSProperties} />)}
    </div>
    <div className="portfolio-vignette" /><div className="film-grain" />
  </div>;
}

function FilmRibbon({ active, onSelect }: { active: number; onSelect: (index: number) => void }) {
  const ribbon = [...portfolioImages, ...portfolioImages];
  return <div className="film-ribbon" aria-label="摄影作品画廊"><div className="film-ribbon-track">
    {ribbon.map((image, index) => {
      const imageIndex = index % portfolioImages.length;
      const duplicate = index >= portfolioImages.length;
      return <button key={`${image.src}-${index}`} type="button" className={active === imageIndex ? "is-active" : ""} tabIndex={duplicate ? -1 : 0} aria-hidden={duplicate || undefined} aria-label={`查看作品：${image.cn}`} onClick={() => onSelect(imageIndex)}>
        <img src={image.src} alt="" loading={imageIndex < 3 ? "eager" : "lazy"} /><em>{image.title}</em>
      </button>;
    })}
  </div></div>;
}

type Ripple = { id: number; x: number; y: number; size: number; faint: boolean };
function RippleLayer({ accent }: { accent: string }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const lastMove = useRef({ time: 0, x: 0, y: 0 });
  useEffect(() => {
    const add = (x: number, y: number, faint: boolean) => {
      const id = ++nextId.current;
      setRipples((items) => [...items.slice(-6), { id, x, y, size: faint ? 62 : 118, faint }]);
      window.setTimeout(() => setRipples((items) => items.filter((item) => item.id !== id)), 920);
    };
    const onDown = (event: PointerEvent) => add(event.clientX, event.clientY, false);
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch" && event.buttons === 0) return;
      const now = performance.now(); const distance = Math.hypot(event.clientX - lastMove.current.x, event.clientY - lastMove.current.y);
      if (now - lastMove.current.time < 85 || distance < 24) return;
      lastMove.current = { time: now, x: event.clientX, y: event.clientY }; add(event.clientX, event.clientY, true);
    };
    window.addEventListener("pointerdown", onDown, { passive: true }); window.addEventListener("pointermove", onMove, { passive: true });
    return () => { window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); };
  }, []);
  return <div className="ripple-layer" style={{ "--ripple-color": accent } as CSSProperties} aria-hidden="true">{ripples.map((ripple) => <i key={ripple.id} className={ripple.faint ? "is-faint" : ""} style={{ left: ripple.x, top: ripple.y, "--ripple-size": `${ripple.size}px` } as CSSProperties} />)}</div>;
}

type PetalGroup = { id: number; x: number; y: number; count: number };
function ClickPetalLayer() {
  const [groups, setGroups] = useState<PetalGroup[]>([]);
  const nextId = useRef(0);
  useEffect(() => {
    const burst = (target: Element, x: number, y: number) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const explicit = Number(target.getAttribute("data-petal-count"));
      const count = Number.isFinite(explicit) && explicit > 0 ? explicit : target.classList.contains("choice") ? 4 : target.classList.contains("primary") ? 9 : target.classList.contains("secondary") ? 6 : 5;
      const id = ++nextId.current;
      setGroups((items) => [...items.slice(-5), { id, x, y, count }]);
      window.setTimeout(() => setGroups((items) => items.filter((item) => item.id !== id)), 1500);
    };
    const onPointer = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest("button,[role='button']");
      if (target) burst(target, event.clientX, event.clientY);
    };
    const onClick = (event: MouseEvent) => {
      if (event.detail !== 0) return;
      const target = (event.target as Element | null)?.closest("button,[role='button']");
      if (!target) return;
      const box = target.getBoundingClientRect(); burst(target, box.left + box.width / 2, box.top + box.height / 2);
    };
    window.addEventListener("pointerdown", onPointer, { passive: true });
    window.addEventListener("click", onClick);
    return () => { window.removeEventListener("pointerdown", onPointer); window.removeEventListener("click", onClick); };
  }, []);
  return <div className="click-petal-layer" aria-hidden="true">{groups.map((group) => <div className="click-petal-group" key={group.id} style={{ left: group.x, top: group.y }}>{Array.from({ length: group.count }, (_, index) => <i key={index} style={{ "--petal-x": `${Math.cos(index * 2.399) * (48 + (index % 4) * 18)}px`, "--petal-y": `${24 + (index % 5) * 17}px`, "--petal-rotation": `${150 + index * 47}deg`, "--petal-delay": `${(index % 5) * 26}ms`, "--petal-color": index % 5 === 0 ? "#f2e9df" : index % 3 === 0 ? "#984b62" : "#ce8196" } as CSSProperties} />)}</div>)}</div>;
}

const propPrompts = ["花或植物", "书、信件或日记", "伞、帽子或丝巾", "镜子或相框", "乐器", "有纪念意义的物品", "泡泡、风或纱", "已经准备好的服装"];
const whyOptions = ["喜欢整体的光线、色彩和氛围", "喜欢自然、不刻意摆拍的人物状态", "喜欢照片中的故事感和情绪表达", "喜欢场景选择和整体画面风格", "有一组或一张具体作品吸引了我", "其他"];
const discoveryOptions = ["小红书首页 · 随意刷到", "小红书搜索特定关键词", "抖音", "B站", "朋友推荐", "微信 · 朋友圈", "以前就关注过", "其他"];

function updateMulti(current: string[], value: string, max?: number) {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (max && current.length >= max) return current;
  return [...current, value];
}

function ChoiceGroup({ options, value, onChange, multiple = false, max, exclusive, ordered = false, compact = false, glow = false }: {
  options: string[]; value: string | string[]; onChange: (value: string | string[]) => void;
  multiple?: boolean; max?: number; exclusive?: string; ordered?: boolean; compact?: boolean; glow?: boolean;
}) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return <div className={`choice-grid ${compact ? "compact" : ""}`}>
    {options.map((option) => {
      const selected = values.includes(option);
      const rank = ordered && selected ? values.indexOf(option) + 1 : null;
      const conflictsWithExclusive = Boolean(exclusive && !selected && (option === exclusive ? values.some((item) => item !== exclusive) : values.includes(exclusive)));
      const reachedLimit = Boolean(multiple && max && !selected && values.length >= max);
      return <button key={option} type="button" className={`choice ${glow ? "mood-choice" : ""} ${selected ? "selected" : ""}`}
        disabled={conflictsWithExclusive || reachedLimit}
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
      onPointerDown={() => { setActive(true); onInteract(); }} onPointerUp={() => setActive(false)} onBlur={() => setActive(false)} onChange={(event) => update(event.target.value)} />
  </div>;
}

function CompositionScale({ value, onChange, onInteract }: { value: number; onChange: (value: number) => void; onInteract: () => void }) {
  const [active, setActive] = useState(false);
  const [boundary, setBoundary] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = (raw: string) => {
    onInteract(); const next = Number(raw); const clamped = Math.min(85, Math.max(15, next)); onChange(clamped);
    if (next < 15 || next > 85) {
      setBoundary(next < 15 ? "人不能太小哦" : "人不能太大哦");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setBoundary(""), 1500);
    }
  };
  return <div className={`composition-scale ${boundary ? "at-boundary" : ""}`}>
    <div className="range-labels subject-labels"><span>环境</span><b>{value}%</b><span>人物</span></div>
    <div className="range-stage">
      <input className={`range subject-range ${active ? "is-dragging" : ""}`} aria-label="人物在画面中的占比" type="range" min="0" max="100" value={value}
        style={{ background: `linear-gradient(90deg,#718d79 0%,#bad2bf ${value}%,#e6dfd5 ${value}%,#886e68 100%)` }}
        onPointerDown={() => { setActive(true); onInteract(); }} onPointerUp={() => setActive(false)} onBlur={() => setActive(false)} onChange={(event) => update(event.target.value)} />
      {boundary && <span className="boundary-tip" role="status">{boundary}</span>}
    </div>
    <div className="range-value">人物约占画面 {value}%，环境约占画面 {100 - value}%</div>
  </div>;
}

function FeelingTagInput({ values, onChange }: { values: string[]; onChange: (values: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const composing = useRef(false);
  const commit = (raw = draft) => {
    const additions = raw.split(/[\s,，、]+/).map((item) => item.trim()).filter(Boolean);
    if (additions.length) onChange(Array.from(new Set([...values, ...additions])));
    setDraft("");
  };
  return <div className="feeling-tag-input">
    <label className="custom-field"><span>还有其他想补充的情绪吗？</span><input value={draft}
      onCompositionStart={() => { composing.current = true; }}
      onCompositionEnd={(event) => { composing.current = false; if (/\s/.test(event.currentTarget.value)) commit(event.currentTarget.value); }}
      onChange={(event) => { const next = event.target.value; if (!composing.current && /\s/.test(next)) commit(next); else setDraft(next); }}
      onKeyDown={(event) => { if (!composing.current && (event.key === "Enter" || event.key === "Tab" || event.key === " ")) { event.preventDefault(); commit(); } }}
      onBlur={() => commit()}
      placeholder="例如：清冷感、潮湿感、疏离感……" /></label>
    {values.length > 0 && <div className="custom-preview-list">{values.map((value) => <div className="custom-preview" key={value}><span>{value}</span><button type="button" aria-label={`删除自定义情绪 ${value}`} onClick={() => onChange(values.filter((item) => item !== value))}>×</button></div>)}</div>}
  </div>;
}

let ambientAudio: HTMLAudioElement | null = null;
let ambientWantsPlayback = true;

function AmbientAudio() {
  const [playing, setPlaying] = useState(ambientWantsPlayback);
  useEffect(() => {
    if (!ambientAudio) {
      ambientAudio = new Audio("/audio/clair-de-lune.mp3");
      ambientAudio.loop = true;
      ambientAudio.preload = "auto";
      ambientAudio.setAttribute("playsinline", "");
    }
    const audio = ambientAudio;
    audio.volume = .28;
    let mounted = true;
    const sync = () => { if (mounted) setPlaying(!audio.paused); };
    const detachUnlock = () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
    const start = async () => {
      if (!ambientWantsPlayback) return;
      try { await audio.play(); sync(); detachUnlock(); } catch { if (mounted) setPlaying(true); }
    };
    const unlock = (event: Event) => {
      if ((event.target as Element | null)?.closest?.(".music-toggle")) return;
      void start();
    };
    audio.addEventListener("play", sync); audio.addEventListener("pause", sync);
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);
    void start();
    return () => { mounted = false; audio.removeEventListener("play", sync); audio.removeEventListener("pause", sync); detachUnlock(); };
  }, []);
  const toggle = () => {
    const audio = ambientAudio;
    if (!audio) return;
    if (audio.paused) { ambientWantsPlayback = true; void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    else { ambientWantsPlayback = false; audio.pause(); setPlaying(false); }
  };
  return <button className={`music-toggle ${playing ? "is-playing" : "is-muted"}`} data-petal-count="2" type="button" onClick={toggle} aria-label={playing ? "静音背景音乐" : "播放背景音乐"} title={playing ? "静音 Clair de Lune" : "播放 Clair de Lune"}><i aria-hidden="true" /></button>;
}

const createPhotoId = () => typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
  ? crypto.randomUUID()
  : `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;

async function prepareMobilePhoto(file: File): Promise<Photo> {
  const originalUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element); element.onerror = reject; element.src = originalUrl;
    });
    const maxEdge = 2000;
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    if (scale === 1 && file.size < 5_000_000) return { id: createPhotoId(), name: file.name, url: originalUrl };
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) return { id: createPhotoId(), name: file.name, url: originalUrl };
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", .84));
    if (!blob) return { id: createPhotoId(), name: file.name, url: originalUrl };
    URL.revokeObjectURL(originalUrl);
    return { id: createPhotoId(), name: file.name.replace(/\.[^.]+$/, ".jpg"), url: URL.createObjectURL(blob) };
  } catch {
    return { id: createPhotoId(), name: file.name, url: originalUrl };
  }
}

function PhotoUpload({ photos, onChange, max, label, required = false }: {
  photos: Photo[]; onChange: (photos: Photo[]) => void; max: number; label: string; required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []).slice(0, Math.max(0, max - photos.length));
    event.target.value = "";
    if (!files.length) return;
    setProcessing(true); setUploadError("");
    const settled = await Promise.allSettled(files.map(prepareMobilePhoto));
    const next = settled.flatMap((item) => item.status === "fulfilled" ? [item.value] : []);
    if (next.length) onChange([...photos, ...next]);
    if (next.length < files.length) setUploadError("部分图片读取失败，请重新选择或先保存为 JPG 后上传");
    setProcessing(false);
  };
  const remove = (id: string) => {
    const target = photos.find((photo) => photo.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(photos.filter((photo) => photo.id !== id));
  };
  return <div>
    <input ref={inputRef} className="file-input" type="file" accept="image/*" multiple onChange={addPhotos} />
    <button type="button" className="upload-zone" disabled={processing || photos.length >= max} onClick={() => inputRef.current?.click()}>
      <span className="upload-plus">＋</span><strong>{processing ? "正在处理图片…" : label}</strong><small>点击选择图片 · 最多 {max} 张 · 仅在本地预览</small>
    </button>
    {uploadError && <p className="upload-error" role="status">{uploadError}</p>}
    {photos.length > 0 && <div className="photo-grid">{photos.map((photo) => <figure key={photo.id}>
      <img src={photo.url} alt={photo.name} />
      <button type="button" aria-label={`移除 ${photo.name}`} onClick={() => remove(photo.id)}>×</button>
    </figure>)}</div>}
  </div>;
}

function Question({ id, number, title, helper, required, optional, children }: { id?: string; number: string; title: string; helper?: ReactNode; required?: boolean; optional?: boolean; children: ReactNode }) {
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
  const [portfolioIndex, setPortfolioIndex] = useState(0);
  const [previousPortfolioIndex, setPreviousPortfolioIndex] = useState(portfolioImages.length - 1);
  const [pageMotion, setPageMotion] = useState<"idle" | "forward-out" | "back-out" | "forward-in" | "back-in">("idle");
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [toast, setToast] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [missingItems, setMissingItems] = useState<MissingItem[]>([]);
  const isDouble = answers.package.startsWith("双人");
  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => setAnswers((old) => ({ ...old, [key]: value }));
  const choosePortfolio = (nextIndex: number) => {
    if (nextIndex === portfolioIndex) return;
    setPreviousPortfolioIndex(portfolioIndex); setPortfolioIndex(nextIndex);
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPreviousPortfolioIndex(portfolioIndex); setPortfolioIndex((portfolioIndex + 1) % portfolioImages.length);
    }, page === 0 ? 7500 : 11000);
    return () => window.clearTimeout(timer);
  }, [page, portfolioIndex]);
  const beginQuestionnaire = () => {
    if (pageMotion !== "idle") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPage(1); return; }
    window.setTimeout(() => { setPage(1); setPageMotion("forward-in"); window.scrollTo({ top: 0 }); }, 420);
    window.setTimeout(() => setPageMotion("idle"), 980);
  };

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
    if (!answers.styleReferencePhotos.length || !answers.styleReferenceReason.trim()) add("q4", 2, "Q4 既往作品参考", "请至少上传一张主页作品截图并说明参考原因");
    if (!answers.subjectScaleTouched || !answers.shots.length) add("q7", 3, "Q7 人物占比偏好", "请调整人物占比并选择景别偏好");
    if (!answers.weather) add("q13", 6, "Q13 偏好的拍摄天气", "请选择一项天气偏好");
    if (!answers.weatherPlan) add("q14", 6, "Q14 天气变化时的处理偏好", "请选择一项处理偏好");
    if (!answers.assistant) add("q15", 6, "Q15 拍摄助手", "请选择是否接受拍摄助手");
    if (!answers.publicity) add("q16", 6, "Q16 照片公开授权", "请选择照片公开授权范围");
    return items;
  };
  const navigatePage = (target: number, direction: "forward" | "back") => {
    if (pageMotion !== "idle" || target === page) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPage(target); window.scrollTo({ top: 0 }); return; }
    setPageMotion(`${direction}-out`);
    window.setTimeout(() => { setPage(target); setPageMotion(`${direction}-in`); window.scrollTo({ top: 0 }); }, 360);
    window.setTimeout(() => setPageMotion("idle"), 900);
  };
  const next = () => navigatePage(Math.min(8, page + 1), "forward");
  const previous = () => navigatePage(Math.max(0, page - 1), "back");
  const jumpToMissing = (item: MissingItem) => {
    setMissingItems([]); setPage(item.page); setPageMotion("back-in");
    window.setTimeout(() => {
      const element = document.getElementById(item.id); element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.classList.add("attention"); window.setTimeout(() => element?.classList.remove("attention"), 1800);
      window.setTimeout(() => setPageMotion("idle"), 650);
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
      const { jsPDF } = await import("jspdf");
      const width = 1240, height = 1754;
      const [coverBackground, ...portfolioBackgrounds] = await Promise.all([
        loadImage("/pdf/archive-cover-sword.jpg"), ...portfolioImages.map((image) => loadImage(image.src)),
      ]);
      const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [width, height], hotfixes: ["px_scaling"] });
      const serif = '"Songti SC", "STSong", "Noto Serif SC", "Microsoft YaHei", serif';
      const makeCanvas = () => { const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas unavailable"); return { canvas, context }; };
      const drawCoverImage = (context: CanvasRenderingContext2D, image: HTMLImageElement, focalX = .5, focalY = .5) => {
        const scale = Math.max(width / image.width, height / image.height);
        const sourceWidth = width / scale, sourceHeight = height / scale;
        const sourceX = Math.max(0, Math.min(image.width - sourceWidth, (image.width - sourceWidth) * focalX));
        const sourceY = Math.max(0, Math.min(image.height - sourceHeight, (image.height - sourceHeight) * focalY));
        context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
      };
      const cover = makeCanvas(); drawCoverImage(cover.context, coverBackground, .5, .55);
      const coverGradient = cover.context.createLinearGradient(0, 0, 0, height);
      coverGradient.addColorStop(0, "rgba(8,12,9,.16)"); coverGradient.addColorStop(.48, "rgba(8,11,9,.12)"); coverGradient.addColorStop(1, "rgba(5,8,6,.76)");
      cover.context.fillStyle = coverGradient; cover.context.fillRect(0, 0, width, height);
      cover.context.strokeStyle = "rgba(248,241,230,.56)"; cover.context.lineWidth = 2; cover.context.strokeRect(54, 54, width - 108, height - 108);
      cover.context.fillStyle = "rgba(250,244,234,.8)"; cover.context.font = "18px Arial"; cover.context.letterSpacing = "5px"; cover.context.fillText("PORTRAIT SESSION · PRIVATE ARCHIVE", 92, 118);
      cover.context.fillStyle = "#fbf4ea"; cover.context.font = 'italic 84px Georgia, "Times New Roman", serif'; cover.context.fillText("Before We Meet", 90, 1270);
      cover.context.font = `500 43px ${serif}`; cover.context.fillText(`${answers.name || "客片"} · 拍摄灵感档案`, 96, 1342);
      cover.context.fillStyle = "rgba(248,241,230,.78)"; cover.context.font = `24px ${serif}`; cover.context.fillText(`${selectedSummary.people}  ·  ${answers.package}`, 98, 1392);
      cover.context.fillStyle = "rgba(248,241,230,.6)"; cover.context.font = "17px Arial"; cover.context.fillText(new Date().toLocaleDateString("zh-CN"), 98, 1640);
      pdf.addImage(cover.canvas.toDataURL("image/jpeg", .92), "JPEG", 0, 0, width, height, undefined, "FAST");

      const margin = 112, contentBottom = 1580;
      let pageNumber = 0, y = 226;
      let sheet = makeCanvas();
      let seed = Array.from(`${answers.name}|${answers.package}|${answers.story}|${answers.inspirationText}`).reduce((value, character) => ((value << 5) - value + character.charCodeAt(0)) | 0, 2166136261) >>> 0;
      const backgroundOrder = portfolioImages.map((_, index) => index);
      for (let index = backgroundOrder.length - 1; index > 0; index--) { seed = (seed * 1664525 + 1013904223) >>> 0; const swapIndex = seed % (index + 1); [backgroundOrder[index], backgroundOrder[swapIndex]] = [backgroundOrder[swapIndex], backgroundOrder[index]]; }
      const pdfFocals = [[.38,.48],[.36,.5],[.46,.52],[.42,.5],[.46,.38],[.46,.5],[.5,.42],[.5,.42],[.5,.43],[.58,.5]];
      const startContentPage = (index: number) => {
        sheet = makeCanvas(); pageNumber = index; y = 226;
        const backgroundIndex = backgroundOrder[(index - 1) % backgroundOrder.length]; const focal = pdfFocals[backgroundIndex];
        drawCoverImage(sheet.context, portfolioBackgrounds[backgroundIndex], focal[0], focal[1]);
        sheet.context.fillStyle = "rgba(8,12,10,.18)"; sheet.context.fillRect(0, 0, width, height);
        sheet.context.fillStyle = "rgba(247,250,248,.62)"; sheet.context.beginPath(); sheet.context.roundRect(58, 62, width - 116, height - 124, 38); sheet.context.fill();
        const sheen = sheet.context.createLinearGradient(58, 62, width - 58, 620);
        sheen.addColorStop(0, "rgba(255,255,255,.38)"); sheen.addColorStop(.42, "rgba(255,255,255,.04)"); sheen.addColorStop(1, "rgba(225,236,232,.08)");
        sheet.context.fillStyle = sheen; sheet.context.beginPath(); sheet.context.roundRect(58, 62, width - 116, height - 124, 38); sheet.context.fill();
        sheet.context.strokeStyle = "rgba(255,255,255,.88)"; sheet.context.lineWidth = 3; sheet.context.beginPath(); sheet.context.roundRect(58, 62, width - 116, height - 124, 38); sheet.context.stroke();
        sheet.context.strokeStyle = "rgba(52,68,59,.13)"; sheet.context.lineWidth = 1; sheet.context.beginPath(); sheet.context.roundRect(64, 68, width - 128, height - 136, 34); sheet.context.stroke();
        sheet.context.fillStyle = "#48574f"; sheet.context.font = "16px Arial"; sheet.context.letterSpacing = "4px"; sheet.context.fillText("PORTRAIT SESSION · INSPIRATION NOTES", margin, 132);
        sheet.context.fillStyle = "#59655f"; sheet.context.font = "16px Arial"; sheet.context.fillText(`PAGE ${String(index).padStart(2, "0")}`, width - margin - 72, 132);
        sheet.context.strokeStyle = "rgba(46,62,53,.22)"; sheet.context.beginPath(); sheet.context.moveTo(margin, 168); sheet.context.lineTo(width - margin, 168); sheet.context.stroke();
      };
      const flushContentPage = () => { pdf.addPage([width, height], "portrait"); pdf.addImage(sheet.canvas.toDataURL("image/jpeg", .9), "JPEG", 0, 0, width, height, undefined, "FAST"); };
      const newPage = () => { flushContentPage(); startContentPage(pageNumber + 1); };
      startContentPage(1);
      const wrap = (content: string, maxWidth: number, size: number) => {
        sheet.context.font = `${size}px ${serif}`; const lines: string[] = []; let line = "";
        for (const char of content || "未填写") { const test = line + char; if (sheet.context.measureText(test).width > maxWidth && line) { lines.push(line); line = char; } else line = test; }
        if (line) lines.push(line); return lines;
      };
      const section = (label: string) => {
        if (y + 150 > contentBottom) newPage();
        y += 34; sheet.context.fillStyle = "#334039"; sheet.context.font = `600 31px ${serif}`; sheet.context.fillText(label, margin, y); y += 30;
        sheet.context.strokeStyle = "rgba(61,73,64,.22)"; sheet.context.beginPath(); sheet.context.moveTo(margin, y); sheet.context.lineTo(width - margin, y); sheet.context.stroke(); y += 42;
      };
      const row = (label: string, value: string | string[]) => {
        const content = Array.isArray(value) ? (value.length ? value.join(" · ") : "未填写") : value || "未填写";
        let lines = wrap(content, width - margin * 2, 26);
        if (y + 76 > contentBottom) newPage();
        sheet.context.fillStyle = "#7e857e"; sheet.context.font = `19px ${serif}`; sheet.context.fillText(label, margin, y); y += 34;
        while (lines.length) {
          if (y + 44 > contentBottom) { newPage(); sheet.context.fillStyle = "#8a908a"; sheet.context.font = `17px ${serif}`; sheet.context.fillText(`${label} · 续`, margin, y); y += 34; }
          const line = lines.shift()!; sheet.context.fillStyle = "#303a33"; sheet.context.font = `26px ${serif}`; sheet.context.fillText(line, margin, y); y += 41;
        }
        y += 20;
      };
      const photos = async (label: string, items: Photo[]) => {
        if (!items.length) { row(label, "未上传"); return; }
        if (y + 300 > contentBottom) newPage();
        sheet.context.fillStyle = "#7e857e"; sheet.context.font = `19px ${serif}`; sheet.context.fillText(label, margin, y); y += 30;
        const cellWidth = 321, cellHeight = 228, gap = 26;
        for (let index = 0; index < items.length; index++) {
          if (index > 0 && index % 3 === 0) y += cellHeight + 28;
          if (y + cellHeight > contentBottom) { newPage(); sheet.context.fillStyle = "#7e857e"; sheet.context.font = `19px ${serif}`; sheet.context.fillText(`${label} · 续`, margin, y); y += 30; }
          const x = margin + (index % 3) * (cellWidth + gap);
          sheet.context.fillStyle = "rgba(38,46,40,.92)"; sheet.context.beginPath(); sheet.context.roundRect(x, y, cellWidth, cellHeight, 12); sheet.context.fill();
          try {
            const image = await loadImage(items[index].url); const ratio = Math.min((cellWidth - 12) / image.width, (cellHeight - 12) / image.height);
            const drawWidth = image.width * ratio, drawHeight = image.height * ratio;
            sheet.context.drawImage(image, x + (cellWidth - drawWidth) / 2, y + (cellHeight - drawHeight) / 2, drawWidth, drawHeight);
          } catch { sheet.context.fillStyle = "#d9d4ca"; sheet.context.font = `18px ${serif}`; sheet.context.fillText("图片读取失败", x + 84, y + 122); }
        }
        y += cellHeight + 42;
      };
      section("01 · 基本信息"); row("拍摄者", selectedSummary.people); row("身高", isDouble ? `${answers.height} cm · ${answers.secondHeight} cm` : `${answers.height} cm`); row("套餐", answers.package); await photos("近期生活照", [...answers.lifePhotos, ...answers.secondLifePhotos]);
      section("02 · 情绪与风格参考"); row("自定义情绪", answers.customFeeling); row("忧郁—生命力", `${answers.moodVitality}%`); row("轻盈—沉重", `${answers.moodWeight}%`); row("克制—热烈", `${answers.moodIntensity}%`); row("参考原因", answers.styleReferenceReason); await photos("主页风格参考", answers.styleReferencePhotos);
      section("03 · 构图与道具"); row("人物画面占比", `${answers.subjectScale}%（环境 ${100 - answers.subjectScale}%）`); row("景别", answers.shots); row("道具或自带物品", answers.propNotes); await photos("道具相关图片", answers.propPhotos);
      section("04 · 灵感与故事"); row("故事构想", answers.story); row("参考链接", answers.inspirationLinks); row("其他参考内容", answers.inspirationText); await photos("灵感图片", answers.inspirationPhotos);
      section("05 · 选择原因与了解渠道"); row("选择原因", answers.why.includes("其他") ? [...answers.why.filter((item) => item !== "其他"), answers.whyOther].filter(Boolean) : answers.why); row("了解渠道", answers.discovery.includes("其他") ? [...answers.discovery.filter((item) => item !== "其他"), answers.discoveryOther].filter(Boolean) : answers.discovery); row("搜索关键词或补充", answers.discoveryDetail);
      section("06 · 拍摄安排与授权"); row("天气偏好", answers.weather); row("天气变化时", answers.weatherPlan); row("拍摄助手", answers.assistant); row("照片公开范围", answers.publicity);
      section("07 · 其他补充"); row("补充内容", answers.noSupplement ? "没有其他补充" : answers.supplement);
      if (y + 100 > contentBottom) newPage(); y += 20; sheet.context.fillStyle = "#59685e"; sheet.context.font = `italic 24px Georgia, ${serif}`; sheet.context.fillText("Thank you for sharing your story.", margin, y); y += 40; sheet.context.fillStyle = "#6c756e"; sheet.context.font = `21px ${serif}`; sheet.context.fillText("请摄影师在拍摄前确认以上信息。", margin, y);
      flushContentPage();
      pdf.save(`${(answers.name || "客片").replace(/[\\/:*?"<>|]/g, "-")}_拍摄灵感档案.pdf`);
    } catch (error) { console.error("PDF export failed", error); notify("PDF 生成遇到问题，请稍后再试"); } finally { setDownloading(false); }
  };

  const currentPortfolio = portfolioImages[portfolioIndex];
  const sceneStyle = { "--scene-accent": currentPortfolio.accent, "--glass-tone": currentPortfolio.glassTone, "--glass-opacity": currentPortfolio.glassOpacity, "--scene-duration": page === 0 ? "7.5s" : "11s" } as CSSProperties;
  const motionClass = pageMotion === "idle" ? "" : `page-${pageMotion}`;
  const alignmentClass = "form-align-right";

  if (page === 0) return <main className="site-shell cover-shell" style={sceneStyle}><PortfolioBackdrop active={portfolioIndex} previous={previousPortfolioIndex} /><RippleLayer accent={currentPortfolio.accent} /><ClickPetalLayer /><AmbientAudio /><section className="cover-stage">
    <div className="cover-title"><h1>Before We Meet</h1><p>拍摄前风格与灵感问卷</p></div>
    <div className="cover-entry"><p>约 6–8 分钟 · 跟随直觉填写</p><button className="cover-button" data-petal-count="26" type="button" onClick={beginQuestionnaire}><span>开始填写</span><i aria-hidden="true" /></button></div>
    <p className="cover-privacy">为保护您的隐私，填写时的数据仅保存在当前设备，最终完成后可导出拍摄档案</p>
    <div className="cover-count"><em>{currentPortfolio.title}</em></div>
  </section><FilmRibbon active={portfolioIndex} onSelect={choosePortfolio} /></main>;

  if (page === 8) { const incomplete = getMissingItems(); return <main className={`site-shell form-shell result-shell ${alignmentClass}`} style={sceneStyle}><PortfolioBackdrop active={portfolioIndex} previous={previousPortfolioIndex} quiet /><RippleLayer accent={currentPortfolio.accent} /><ClickPetalLayer /><AmbientAudio /><section className={`questionnaire-card result-page ${motionClass}`}>
    <div className="result-heading"><p className="eyebrow">PORTRAIT SESSION · FORM SUMMARY</p><h2>问卷填写完成</h2><p>{selectedSummary.people} · {selectedSummary.package}</p></div>
    <div className="result-document">
      <section><h3>01 · 基本信息</h3><ResultItem label="称呼">{selectedSummary.people}</ResultItem><ResultItem label="套餐">{answers.package}</ResultItem></section>
      <section><h3>02 · 情绪与风格参考</h3><ResultItem label="自定义情绪"><Tags values={answers.customFeeling} /></ResultItem><ResultItem label="三组情绪滑块">忧郁—生命力 {answers.moodVitality}% · 轻盈—沉重 {answers.moodWeight}% · 克制—热烈 {answers.moodIntensity}%</ResultItem><ResultItem label="风格参考原因">{answers.styleReferenceReason}</ResultItem></section>
      <section><h3>03 · 构图与道具</h3><ResultItem label="人物画面占比">{answers.subjectScale}%</ResultItem><ResultItem label="景别"><Tags values={answers.shots} /></ResultItem><ResultItem label="道具或自带物品">{answers.propNotes}</ResultItem></section>
      <section><h3>04 · 灵感与故事</h3><ResultItem label="故事构想">{answers.story}</ResultItem><ResultItem label="其他参考">{answers.inspirationText}</ResultItem></section>
      <section><h3>05 · 选择原因与渠道</h3><ResultItem label="选择原因"><Tags values={answers.why.includes("其他") ? [...answers.why.filter((item) => item !== "其他"), answers.whyOther].filter(Boolean) : answers.why} /></ResultItem><ResultItem label="了解渠道"><Tags values={answers.discovery.includes("其他") ? [...answers.discovery.filter((item) => item !== "其他"), answers.discoveryOther].filter(Boolean) : answers.discovery} /></ResultItem></section>
      <section><h3>06 · 拍摄安排与授权</h3><ResultItem label="天气">{answers.weather}</ResultItem><ResultItem label="拍摄助手">{answers.assistant}</ResultItem><ResultItem label="公开范围">{answers.publicity}</ResultItem></section>
      <section><h3>07 · 其他补充</h3><ResultItem label="补充内容">{answers.noSupplement ? "没有其他补充" : answers.supplement}</ResultItem></section>
    </div>
    {incomplete.length > 0 && <div className="incomplete-note"><b>还有 {incomplete.length} 项必答内容没有完成</b><span>您可以点击下载 PDF，查看下载前需要补充这些内容。</span></div>}
    <div className="result-actions"><button className="primary" data-petal-count="11" type="button" disabled={downloading} onClick={downloadPdf}>{downloading ? "正在整理故事…" : "下载 PDF 拍摄档案"}</button><button className="secondary" data-petal-count="7" type="button" onClick={() => navigatePage(6, "back")}>返回修改</button></div>
    <p className="privacy">PDF 在当前设备本地生成。页面不会自动发送或保存您的回答。</p>
    {toast && <div className="toast">{toast}</div>}
    {missingItems.length > 0 && <div className="modal-backdrop" role="presentation"><section className="missing-modal" role="dialog" aria-modal="true" aria-labelledby="missing-title"><button className="modal-close" type="button" aria-label="关闭" onClick={() => setMissingItems([])}>×</button><p className="eyebrow">REQUIRED INFORMATION</p><h2 id="missing-title">还有 {missingItems.length} 项需要补充</h2><p>完成以下必答内容后，才能导出 PDF。点击任意一项可直接回到对应问题。</p><div className="missing-list">{missingItems.map((item) => <button key={item.id} type="button" onClick={() => jumpToMissing(item)}><span>{item.chapter} · {item.question}</span><small>{item.detail}</small><b>去填写 →</b></button>)}</div></section></div>}
  </section></main>; }

  return <main className={`site-shell form-shell ${alignmentClass}`} style={sceneStyle}><PortfolioBackdrop active={portfolioIndex} previous={previousPortfolioIndex} quiet /><RippleLayer accent={currentPortfolio.accent} /><ClickPetalLayer /><AmbientAudio /><section className={`questionnaire-card form-card ${motionClass}`}>
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
        <FeelingTagInput values={answers.customFeeling} onChange={(values) => set("customFeeling", values)} />
      </Question>
      <Question id="q4" number="04" title="这次拍摄，您希望参考我哪些既往作品的感觉？" required helper={<>请从我的小红书主页中选择最接近您预期的照片，并上传截图作为参考。<a className="reference-link" href="https://www.xiaohongshu.com/user/profile/6427c8ae0000000012011b86?xsec_token=ABlynNcfdmoYkwZT_ZRnoRGekrMnsvjyTlaTlOowh4pU0%3D&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" aria-label="在新标签页打开摄影师的小红书主页" title="打开小红书主页"><i aria-hidden="true" /></a></>}>
        <PhotoUpload photos={answers.styleReferencePhotos} onChange={(v) => set("styleReferencePhotos", v)} max={6} required label="上传主页作品截图" />
        <label className="textarea-field"><span>希望参考这张作品中的哪些部分？</span><textarea value={answers.styleReferenceReason} onChange={(event) => set("styleReferenceReason", event.target.value)} rows={5} placeholder="可以从人物状态、光线、色彩、构图、场景或整体氛围进行说明。请告诉我，希望在本次拍摄中保留或适度复现其中的哪些特点。" /></label>
      </Question>
    </>}

    {page === 3 && <>
      <Question id="q7" number="07" title="人物占比偏好" required helper="调整人物在画面中的大致占比。数值越低，环境所占比例越高；数值越高，人物越突出。">
        <CompositionScale value={answers.subjectScale} onChange={(v) => set("subjectScale", v)} onInteract={() => set("subjectScaleTouched", true)} />
        <h4>景别偏好</h4><ChoiceGroup compact options={["面部或局部特写", "半身", "全身", "人物与环境的大景", "没有特别偏好"]} value={answers.shots} onChange={(v) => set("shots", v as string[])} multiple max={2} exclusive="没有特别偏好" />
      </Question>
      <Question number="08" title="拍摄道具或自带物品" optional helper="该题为选填，用于告诉我您想出现的元素，如果暂时没想好也可以选择不填，则代表希望摄影师自由根据主题来准备与策划。">
        <div className="prompt-list" aria-label="填写提示">{propPrompts.map((item) => <span key={item}>{item}</span>)}</div>
        <label className="textarea-field"><span>内容说明</span><textarea value={answers.propNotes} onChange={(e) => set("propNotes", e.target.value)} rows={6} placeholder="例如：准备携带一本旧书和一条白色丝巾；希望在部分照片中使用，但不需要贯穿整组拍摄。" /></label>
        <PhotoUpload photos={answers.propPhotos} onChange={(v) => set("propPhotos", v)} max={6} label="上传相关图片" />
      </Question>
    </>}

    {page === 4 && <>
      <Question number="09" title="其他参考内容" optional helper="如果还有电影、书籍、音乐、文字或社交媒体内容可供参考，可以在这里补充。">
        <PhotoUpload photos={answers.inspirationPhotos} onChange={(v) => set("inspirationPhotos", v)} max={8} label="上传灵感图片" />
        <label className="textarea-field"><span>参考链接 · 每行一个</span><textarea value={answers.inspirationLinks} onChange={(e) => set("inspirationLinks", e.target.value)} rows={3} placeholder="粘贴小红书、B站、电影页面或其他链接……" /></label>
        <label className="textarea-field"><span>作品名称或补充说明</span><textarea value={answers.inspirationText} onChange={(e) => set("inspirationText", e.target.value)} rows={4} placeholder="请说明希望参考的内容，以及其中值得注意的元素。" /></label>
      </Question>
      <Question number="10" title="为这次约拍构造一个故事" optional helper={isDouble ? "每一次创作都可以从一个简单的故事设定开始。您可以设定您与同行者之间的关系，以及希望表现的相处状态，例如《花与爱丽丝》中亲密、自然又带有复杂情绪的友谊。无需写完整剧本，人物关系、地点、事件或几个关键词都可以。" : "每一次创作都可以从一个简单的故事设定开始。您可以想象自己以怎样的身份进入画面，例如《呼啸山庄》中带有疏离感和生命力的人物，也可以只是某个在旅途中短暂停留的人。无需写完整剧本，人物身份、地点、事件或几个关键词都可以。"}>
        <label className="textarea-field"><span>故事设定</span><textarea value={answers.story} onChange={(e) => set("story", e.target.value)} rows={7} placeholder={isDouble ? "例如：两位多年未见的朋友在夏末重逢，一起沿河散步。" : "例如：一个人结束一段旅程，在傍晚的树林中短暂停留。"} /></label>
      </Question>
    </>}

    {page === 5 && <>
      <Question number="11" title="您选择我的主要原因" optional helper="这道题不会影响拍摄安排，但对我很重要。您的回答会帮助我了解大家最关注的内容，并用于后续改善作品呈现和服务方式。最多选择三个。"><ChoiceGroup options={whyOptions} value={answers.why} onChange={(v) => set("why", v as string[])} multiple max={3} />
        {answers.why.includes("其他") && <label className="custom-field conditional-field"><span>其他原因</span><input value={answers.whyOther} onChange={(event) => set("whyOther", event.target.value)} placeholder="请填写具体原因" /></label>}
      </Question>
      <Question number="12" title="您是在哪里了解到我的？" optional helper="这道题不会影响拍摄安排，但对我很重要。您的回答会帮助我了解大家通常通过什么渠道找到我，以便后续优化内容和服务。可多选。"><ChoiceGroup options={discoveryOptions} value={answers.discovery} onChange={(v) => set("discovery", v as string[])} multiple />
        {answers.discovery.includes("其他") && <label className="custom-field conditional-field"><span>其他渠道</span><input value={answers.discoveryOther} onChange={(event) => set("discoveryOther", event.target.value)} placeholder="请填写具体渠道" /></label>}
        <label className="textarea-field"><span>搜索关键词或补充说明</span><textarea value={answers.discoveryDetail} onChange={(e) => set("discoveryDetail", e.target.value)} rows={3} placeholder="如果通过搜索找到，可以填写当时使用的关键词。" /></label>
      </Question>
    </>}

    {page === 6 && <>
      <Question id="q13" number="13" title="偏好的拍摄天气" required><ChoiceGroup options={["阳光明亮 · 有明显光影", "柔和晴天 · 光线不太强", "阴天安静 · 低饱和", "小雨或雾气 · 更有电影感", "没有特别偏好"]} value={answers.weather} onChange={(v) => set("weather", v as string)} /></Question>
      <Question id="q14" number="14" title="天气变化时的处理偏好" required helper="最终是否改期会结合天气安全、场地条件和双方时间共同确认。"><ChoiceGroup options={["普通阴天也可以 · 不同天气有不同表达", "阴天可以 · 明显下雨希望协商改期", "比较期待阳光 · 无阳光希望协商改期", "由摄影师根据主题、光线和安全情况判断"]} value={answers.weatherPlan} onChange={(v) => set("weatherPlan", v as string)} /></Question>
      <Question id="q15" number="15" title="拍摄助手" required helper="拍摄当天可能有一位助手同行，协助使用吹风机、泡泡机、反光板以及记录花絮。助手可能为异性，不产生额外费用。"><ChoiceGroup options={["可以接受", "不希望有其他助手同行"]} value={answers.assistant} onChange={(v) => set("assistant", v as string)} /></Question>
      <Question id="q16" number="16" title="照片公开授权" required helper="是否授权不会影响本次拍摄和交付。"><ChoiceGroup options={["同意公开至摄影作品展示", "不同意任何公开发布"]} value={answers.publicity} onChange={(v) => set("publicity", v as string)} /></Question>
    </>}

    {page === 7 && <Question number="17" title="还有其他需要我提前了解的内容吗？" optional helper="可以补充身体活动限制、对镜头的担心、希望避开的内容、照片用途，或任何前面没有覆盖的信息。">
      {!answers.noSupplement && <label className="textarea-field"><span>补充内容</span><textarea value={answers.supplement} onChange={(event) => set("supplement", event.target.value)} rows={7} placeholder="如果有任何需要提前沟通的内容，都可以写在这里。" /></label>}
      <button type="button" className={`no-supplement ${answers.noSupplement ? "selected" : ""}`} aria-pressed={answers.noSupplement} onClick={() => { set("noSupplement", !answers.noSupplement); if (!answers.noSupplement) set("supplement", ""); }}><span>{answers.noSupplement ? "✓" : "○"}</span>没有其他补充</button>
    </Question>}

    <nav className="page-actions"><button className="secondary" data-petal-count="7" type="button" onClick={previous}>返回</button><button className="primary" data-petal-count={page === 7 ? "11" : "8"} type="button" onClick={next}>{page === 7 ? "确认并生成档案" : "继续下一章"}</button></nav>
    {toast && <div className="toast" role="status">{toast}</div>}
  </section></main>;
}
