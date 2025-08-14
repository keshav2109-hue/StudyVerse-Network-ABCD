
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <>
      <style jsx global>{`
        .footerSection {
          background-color: #020617;
          color: #cbd5e1;
          font-family: Arial, sans-serif;
          border-top: 1px solid #1e293b;
        }
        .footerSection a {
          color: #94a3b8;
          transition: color 0.3s;
          text-decoration: none;
        }
        .footerSection a:hover {
          color: white;
        }
        .footerLogo img {
          max-width: 100px;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .footTitle {
          font-size: 16px;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
        }
        .orgName {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 8px;
          color: white;
        }
        .orgAddress {
          font-size: 14px;
          color: #94a3b8;
        }
        .footerBottom {
          border-top: 1px solid #1e293b;
          padding: 15px 20px;
          background-color: #0f172a;
        }
        .copyrighttitle {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }
        .social-icon {
          font-size: 18px;
          color: white;
          margin-left: 15px;
          transition: color 0.3s;
        }
        .social-icon:hover {
          color: #38bdf8;
        }
      `}</style>
      <footer className="footerSection">
        <div className="container-fluid py-4 p-0">
          <div className="row mx-auto justify-content-start gap-lg-5 px-4">
            {/* Logo & Address */}
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className="footerLogo">
                <Image src="https://i.postimg.cc/rsKZhQbz/image.png" alt="EduVerse" width={100} height={100} />
              </div>
              <div className="orgName">EduVerse Network</div>
               <p className="orgAddress">High-quality education for all.</p>
            </div>
            {/* Products */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
              <h4 className="footTitle">Courses</h4>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link href="/edu9">Class 9th</Link>
                </li>
                <li className="mb-2">
                  <Link href="/edu10">Class 10th</Link>
                </li>
                <li className="mb-2">
                  <Link href="/pcmb">Class 11th (Science)</Link>
                </li>
                <li className="mb-2">
                  <Link href="/commerce">Class 11th (Commerce)</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footerBottom d-flex flex-wrap align-items-center justify-content-between">
          <p className="copyrighttitle">
            &copy; 2025 EduVerse Network. All Rights Reserved.
          </p>
          <div className="foot-social">
            <a
              href="https://www.youtube.com/@EduVerse_Network"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="bi bi-youtube"></i>
            </a>
            <a
              href="https://t.me/EduVerse_Network"
              className="social-icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <i className="bi bi-send-fill"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
