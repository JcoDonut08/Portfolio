export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner" data-reveal="footer">
        <a aria-label="Back to the top" className="footer-mark" href="#home">
          JPS
        </a>

        <nav aria-label="Footer navigation" className="footer-nav">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#education">Education</a>
          <a href="#contact">Contact</a>
          <a download href="/assets/resume/Jericho-Salvador-Resume.pdf">
            Résumé
          </a>
        </nav>

        <p>© 2026 Jericho Paul Salvador</p>
      </div>
    </footer>
  );
}
