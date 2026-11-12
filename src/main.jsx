import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { profile, projects, strengths } from './content'
import './style.css'

const media = (path) => import.meta.env.BASE_URL + path
const emailLink = profile.email ? 'mailto:' + profile.email : undefined
const links = [['about', '关于'], ['work', '作品'], ['strengths', '优势']]

function HeroVideo() {
  const video = useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [autoPlay] = React.useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      if (preference.matches) video.current.pause()
      else video.current.play().catch(() => {})
    }
    sync()
    preference.addEventListener('change', sync)
    return () => preference.removeEventListener('change', sync)
  }, [])

  return <>
    <video ref={video} className="hero-video" muted autoPlay={autoPlay} loop playsInline preload="metadata"
      onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
      poster={media('media/hero.jpg')} src={media('media/hero.mp4')} aria-hidden="true" />
    <button className="motion-control" type="button" onClick={() => {
      if (video.current.paused) video.current.play().catch(() => {})
      else video.current.pause()
    }}>{playing ? '暂停背景' : '播放背景'}</button>
  </>
}

function ProjectGallery() {
  const dialog = useRef(null)
  const [activeProject, setActiveProject] = React.useState(null)

  useEffect(() => {
    if (activeProject && !dialog.current.open) dialog.current.showModal()
  }, [activeProject])

  return <section id="work" className="section wrap">
    <div className="section-heading">
      <div><p className="eyebrow">SELECTED WORK</p><h2>精选作品</h2></div>
      <span className="note">示例项目 · 待替换</span>
    </div>
    <div className="project-grid">
      {projects.map((project) => <button type="button" className="project" key={project.id}
        onClick={() => setActiveProject(project)}>
        <div className="project-image"><img src={media(project.image)} alt={project.alt} loading="lazy" /></div>
        <div className="project-caption">
          <div><span className="eyebrow">{project.english}</span><h3>{project.title}</h3></div>
          <span className="category">{project.category}</span><span className="round" aria-hidden="true">↗</span>
        </div>
      </button>)}
    </div>
    <dialog ref={dialog} aria-labelledby="project-title" onClose={() => setActiveProject(null)}>
      {activeProject && <article>
        <button className="dialog-close round" onClick={() => dialog.current.close()} aria-label="关闭项目" autoFocus>×</button>
        <img src={media(activeProject.image)} alt={activeProject.alt} />
        <div className="dialog-content">
          <p className="eyebrow">示例项目 / {activeProject.category}</p>
          <h2 id="project-title">{activeProject.title}</h2>
          <p>{activeProject.description}</p>
        </div>
      </article>}
    </dialog>
  </section>
}

function App() {
  return <>
    <a className="skip" href="#about">跳到主要内容</a>
    <section className="hero" id="top" aria-labelledby="hero-title">
      <HeroVideo />
      <div className="hero-shade" />
      <header className="header wrap">
        <a className="wordmark" href="#top"><span className="mark" aria-hidden="true">✳</span> {profile.name || 'DESIGN PORTFOLIO'}</a>
        <nav aria-label="主导航">{links.map(([id, label]) => <a key={id} href={'#' + id}>{label}</a>)}</nav>
        <a className="pill outline" href="#contact">联系我 <span aria-hidden="true">↗</span></a>
      </header>
      <div className="hero-body wrap">
        <p className="eyebrow"><span className="dot" /> 视觉设计 / AI 设计 / 品牌设计</p>
        <h1 id="hero-title">Visual<br /><em>Practice<span>.</span></em></h1>
        <p className="hero-description">用视觉建立识别，让想法成为可感知的形态。</p>
        <a className="pill primary" href="#work">浏览作品 <span aria-hidden="true">↗</span></a>
      </div>
      <div className="hero-foot wrap">
        <a href="#about"><span aria-hidden="true">↓</span> 向下探索</a>
        <span>VISUAL / AI / BRAND</span>
      </div>
    </section>

    <main>
      <section id="about" className="section wrap">
        <div className="about-grid">
          <figure className="portrait">
            <img src={profile.portrait || media('media/profile.jpg')} alt={profile.portrait ? '设计师肖像' : '用于预览的人物剪影'} loading="lazy" />
            {!profile.portrait && <figcaption>人物图占位</figcaption>}
          </figure>
          <div className="about-content">
            <p className="eyebrow">ABOUT</p>
            <h2>{profile.name ? '关于 ' + profile.name : '关于我'}</h2>
            <p className="bio">{profile.bio}</p>
            <a className="text-link" href={emailLink || '#contact'}>{profile.email || '查看联系方式'} <span aria-hidden="true">↗</span></a>
            <dl className="metrics">{profile.metrics.map(({ value, label }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </div>
        </div>
      </section>

      <ProjectGallery />

      <section id="strengths" className="section wrap">
        <div className="section-heading"><div><p className="eyebrow">CAPABILITIES</p><h2>个人优势</h2></div></div>
        <div className="strength-grid">{strengths.map((strength) => <article className="strength" key={strength.title}>
          <span className="strength-icon" aria-hidden="true">{strength.symbol}</span>
          <p className="eyebrow">{strength.label}</p><h3>{strength.title}</h3><p>{strength.description}</p>
        </article>)}</div>
      </section>
    </main>

    <footer id="contact" className="contact">
      <div className="wrap contact-content">
        <p className="eyebrow"><span className="dot" /> CONTACT</p>
        <h2>一起做点<br />有意思的设计<span>.</span></h2>
        {emailLink ? <a className="pill primary" href={emailLink}>{profile.email} ↗</a> : <p className="contact-placeholder">联系邮箱待补充</p>}
      </div>
      <div className="wrap footer-line"><span>{profile.name || 'DESIGN PORTFOLIO'}</span><a href="#top">回到顶部 ↑</a></div>
    </footer>
  </>
}

createRoot(document.getElementById('root')).render(<App />)
