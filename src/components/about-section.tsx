import Link from "next/link";

const experience = [
  { title: "AgriFarm", role: "Full-stack development", context: "Laravel, React, and Inertia", description: "A local marketplace connecting the customer journey with seller tools and server-side application rules.", slug: "agrifarm" },
  { title: "GabayIskolar", role: "Frontend development", context: "The Prompters · OVERCLOCK 2026", description: "A team hackathon prototype that makes scholarship preparation easier to navigate.", slug: "gabayiskolar" },
  { title: "Loveby Ade", role: "Team leadership & full-stack development", context: "Academic team project", description: "Development, interface design, and quality assurance in a three-person e-commerce team.", slug: "loveby-ade" },
];

export function AboutSection() {
  return (
    <section aria-labelledby="about-title" className="profile-section" id="about">
      <div className="profile-copy"><p className="section-kicker">A little about me</p><h2 id="about-title">Thoughtful interfaces.<br/><span>Connected systems.</span></h2>
        <p>I&apos;m Jericho Salvador, a fourth-year Computer Science student at Pamantasan ng Lungsod ng Pasig. I enjoy both shaping the interface people use and connecting it to the logic that makes an application work.</p>
        <p>My projects span a Laravel and React marketplace, a scholarship preparation interface, a dessert storefront, and a mobile discovery prototype. I&apos;m looking for an internship where I can contribute, learn from a development team, and keep building across the web stack.</p>
        <dl className="profile-facts"><div><dt>Based in</dt><dd>Pasig City, Philippines</dd></div><div><dt>Degree</dt><dd>BS Computer Science · Fourth year</dd></div><div><dt>Graduation</dt><dd>Expected April 2027</dd></div><div><dt>Interested in</dt><dd>Frontend &amp; full-stack internships</dd></div></dl>
        <a className="text-link" download href="/assets/resume/Jericho-Salvador-Resume.pdf">Download my résumé</a>
      </div>
      <div className="experience-list"><p className="section-kicker">Project experience</p>{experience.map((item) => <article key={item.slug}><p className="experience-role">{item.role}</p><h3><Link href={`/projects/${item.slug}`}>{item.title}</Link></h3><p className="experience-context">{item.context}</p><p>{item.description}</p></article>)}</div>
    </section>
  );
}
