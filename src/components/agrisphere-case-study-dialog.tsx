"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  type MouseEvent,
  type RefObject,
} from "react";

const catalogProducts = [
  {
    image: "/assets/projects/agrisphere/sunflower-seed.png",
    name: "Sunflower seed",
  },
  {
    image: "/assets/projects/agrisphere/salmon.png",
    name: "Salmon",
  },
  {
    image: "/assets/projects/agrisphere/carrot.png",
    name: "Carrot",
  },
  {
    image: "/assets/projects/agrisphere/mango.png",
    name: "Mango",
  },
] as const;

const systemLayers = [
  {
    description:
      "Category filters, search, product discovery, cart handling, purchases, and ratings shape the public buying flow.",
    title: "Buyer marketplace",
  },
  {
    description:
      "A dedicated workspace gives sellers access to profile, product, order, notification, and trend-management views.",
    title: "Seller operations",
  },
  {
    description:
      "User administration, account controls, audit logs, verification, and MFA support the platform's oversight layer.",
    title: "Admin and security",
  },
] as const;

type AgriSphereCaseStudyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

function MarketplacePreview() {
  return (
    <figure className="agrisphere-showcase agrisphere-showcase--wide">
      <div className="agrisphere-browser-frame">
        <div aria-hidden="true" className="agrisphere-browser-bar">
          <span />
          <span />
          <span />
          <p>agrisphere.local</p>
        </div>
        <div className="agrisphere-home-preview">
          <div className="agrisphere-home-nav">
            <span className="agrisphere-preview-brand">
              <Image
                alt=""
                aria-hidden="true"
                height={44}
                src="/assets/projects/agrisphere/logo.png"
                width={44}
              />
              AgriSphere
            </span>
            <span className="agrisphere-preview-links">
              <span>Home</span>
              <span>Products</span>
              <span>Contact</span>
            </span>
            <span className="agrisphere-preview-login">Login</span>
          </div>
          <div className="agrisphere-home-hero">
            <Image
              alt="Farmers working in a sunlit vegetable field"
              fill
              sizes="(max-width: 760px) 90vw, 70rem"
              src="/assets/projects/agrisphere-homepage.jpg"
            />
            <div className="agrisphere-home-copy">
              <strong>
                Empowering <span>Agriculture</span>
                <br />
                One Click at a Time
              </strong>
              <p>Quality farm products in one digital marketplace.</p>
              <span className="agrisphere-preview-action">Shop now</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption>
        <strong>Public marketplace</strong>
        <span>
          A direct landing experience guides buyers from the platform promise
          into product discovery.
        </span>
      </figcaption>
    </figure>
  );
}

function CatalogPreview() {
  return (
    <figure className="agrisphere-showcase agrisphere-showcase--wide">
      <div className="agrisphere-browser-frame">
        <div aria-hidden="true" className="agrisphere-browser-bar">
          <span />
          <span />
          <span />
          <p>agrisphere.local/products</p>
        </div>
        <div className="agrisphere-catalog-preview">
          <div className="agrisphere-catalog-toolbar">
            <div className="agrisphere-category-list">
              <span data-active="true">All</span>
              <span>Crops</span>
              <span>Fish</span>
              <span>Fruits</span>
            </div>
            <span className="agrisphere-search-preview">Search products…</span>
          </div>
          <strong className="agrisphere-catalog-title">Browse products</strong>
          <div className="agrisphere-product-grid">
            {catalogProducts.map((product) => (
              <article key={product.name}>
                <div className="agrisphere-product-image">
                  <Image
                    alt={product.name}
                    height={512}
                    src={product.image}
                    width={512}
                  />
                </div>
                <strong>{product.name}</strong>
                <span>Available from local sellers</span>
                <span className="agrisphere-product-action">Add to cart</span>
              </article>
            ))}
          </div>
        </div>
      </div>
      <figcaption>
        <strong>Product discovery</strong>
        <span>
          Categories, search, availability, ratings, and cart actions keep the
          catalog useful without crowding the buying path.
        </span>
      </figcaption>
    </figure>
  );
}

function SellerPreview() {
  const profileFields = [
    ["Username", "Seller account"],
    ["Email", "seller@agrisphere.local"],
    ["Business name", "Farm store"],
    ["Address", "Pasig City"],
  ] as const;

  return (
    <figure className="agrisphere-showcase">
      <div className="agrisphere-dashboard-preview">
        <aside>
          <span className="agrisphere-dashboard-brand">
            <Image alt="" height={32} src="/assets/projects/agrisphere/logo.png" width={32} />
            AgriSphere
          </span>
          <span>Dashboard</span>
          <span data-active="true">Profile</span>
          <span>Products</span>
          <span>Orders</span>
          <span>Trends</span>
        </aside>
        <div className="agrisphere-profile-preview">
          <strong>Profile information</strong>
          <div>
            {profileFields.map(([label, value]) => (
              <label key={label}>
                <span>{label}</span>
                <span>{value}</span>
              </label>
            ))}
            <span className="agrisphere-save-preview">Save all</span>
          </div>
        </div>
      </div>
      <figcaption>
        <strong>Seller workspace</strong>
        <span>
          Sellers move between identity, inventory, orders, and trends from a
          consistent dashboard shell. Account values shown here are
          illustrative.
        </span>
      </figcaption>
    </figure>
  );
}

function AuditPreview() {
  const auditRows = [
    ["Admin user", "Logged in", "Admin"],
    ["Seller account", "Logged out", "Seller"],
    ["Buyer account", "Logged in", "Buyer"],
    ["Admin user", "Unlocked an account", "Admin"],
  ] as const;

  return (
    <figure className="agrisphere-showcase">
      <div className="agrisphere-dashboard-preview agrisphere-dashboard-preview--audit">
        <aside>
          <span className="agrisphere-dashboard-brand">
            <Image alt="" height={32} src="/assets/projects/agrisphere/logo.png" width={32} />
            AgriSphere
          </span>
          <span>Dashboard</span>
          <span data-active="true">Audit logs</span>
          <span>Add admin</span>
          <span>Users</span>
        </aside>
        <div className="agrisphere-audit-preview">
          <strong>Audit logs of administrators</strong>
          <div className="agrisphere-audit-table">
            <span className="agrisphere-audit-heading">User</span>
            <span className="agrisphere-audit-heading">Action</span>
            <span className="agrisphere-audit-heading">Role</span>
            {auditRows.flatMap(([user, action, role]) => [
              <span key={`${user}-${action}-user`}>{user}</span>,
              <span data-action={action} key={`${user}-${action}-action`}>
                {action}
              </span>,
              <span key={`${user}-${action}-role`}>{role}</span>,
            ])}
          </div>
        </div>
      </div>
      <figcaption>
        <strong>Administrative traceability</strong>
        <span>
          Role-aware audit records make account activity and administrative
          actions easier to review.
        </span>
      </figcaption>
    </figure>
  );
}

export function AgriSphereCaseStudyDialog({
  isOpen,
  onClose,
  returnFocusRef,
}: AgriSphereCaseStudyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    }

    if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const returnFocusElement = returnFocusRef.current;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      returnFocusElement?.focus();
    };
  }, [isOpen, returnFocusRef]);

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <dialog
      aria-describedby="agrisphere-case-study-summary"
      aria-labelledby="agrisphere-case-study-title"
      className="project-case-study-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={handleBackdropClick}
      ref={dialogRef}
    >
      <button
        aria-label="Close AgriSphere case study"
        className="project-case-study-close"
        onClick={onClose}
        ref={closeButtonRef}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>

      <div className="project-case-study-scroll">
        <header className="project-case-study-hero">
          <div className="project-case-study-copy">
            <h2 id="agrisphere-case-study-title">AgriSphere</h2>
            <p id="agrisphere-case-study-summary">
              A role-based agricultural marketplace connecting buyers and
              sellers through product discovery, ordering, operational tools,
              account security, and crop forecasting.
            </p>
            <dl className="project-case-study-facts">
              <div>
                <dt>Role</dt>
                <dd>Frontend Developer</dd>
              </div>
              <div>
                <dt>System</dt>
                <dd>Buyer · Seller · Admin</dd>
              </div>
              <div>
                <dt>Stack</dt>
                <dd>PHP · JavaScript · CSS · Python · Flask</dd>
              </div>
            </dl>
          </div>
          <MarketplacePreview />
        </header>

        <section className="project-case-study-section" aria-labelledby="agrisphere-system-title">
          <div className="project-case-study-section-heading">
            <h3 id="agrisphere-system-title">One marketplace, three working views.</h3>
            <p>
              The frontend has to keep a simple public buying experience while
              exposing the deeper operational tools each authenticated role
              needs.
            </p>
          </div>
          <ol className="project-case-study-flow">
            {systemLayers.map((layer) => (
              <li key={layer.title}>
                <strong>{layer.title}</strong>
                <p>{layer.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="project-case-study-section" aria-labelledby="agrisphere-tour-title">
          <div className="project-case-study-section-heading">
            <h3 id="agrisphere-tour-title">A closer look at the interface.</h3>
            <p>
              These rebuilt, responsive views use the original project assets
              to show how the public catalog and role-based dashboards fit
              together.
            </p>
          </div>
          <div className="agrisphere-interface-gallery">
            <CatalogPreview />
            <SellerPreview />
            <AuditPreview />
          </div>
        </section>

        <section className="project-case-study-section" aria-labelledby="agrisphere-forecast-title">
          <div className="project-case-study-section-heading">
            <h3 id="agrisphere-forecast-title">Forecasting extends the marketplace.</h3>
            <p>
              A Flask and Python layer turns agricultural seasonality into
              harvestability and rainfall-likelihood outputs that can inform
              planning beyond the transaction itself.
            </p>
          </div>
          <div className="agrisphere-forecast-gallery">
            <figure>
              <div className="agrisphere-forecast-image">
                <Image
                  alt="Heatmap showing monthly harvestability forecasts for Philippine crops"
                  height={1293}
                  src="/assets/projects/agrisphere/harvestability-heatmap.png"
                  width={1919}
                />
              </div>
              <figcaption>
                <strong>Harvestability forecast</strong>
                <span>Monthly in-season, mid-season, and scarcity signals.</span>
              </figcaption>
            </figure>
            <figure>
              <div className="agrisphere-forecast-image">
                <Image
                  alt="Area chart showing monthly rainfall and typhoon likelihood forecast"
                  height={1016}
                  src="/assets/projects/agrisphere/rainfall-likelihood.png"
                  width={2048}
                />
              </div>
              <figcaption>
                <strong>Rainfall likelihood</strong>
                <span>A seasonal view of changing weather risk across the year.</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <footer className="project-case-study-footer">
          <div>
            <strong>Explore the implementation.</strong>
            <p>The source includes the PHP MVC application and its Python forecasting service.</p>
          </div>
          <a
            href="https://github.com/JcoDonut08/AgriSphere-Grp9"
            rel="noreferrer"
            target="_blank"
          >
            View repository
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </footer>
      </div>
    </dialog>
  );
}
