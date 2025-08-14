
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <>
      <style jsx global>{`
        .footerSection {
          background-color: #1e2a38;
          color: white;
          font-family: Arial, sans-serif;
        }
        .footerSection a {
          color: #ccc;
          transition: color 0.3s;
          text-decoration: none;
        }
        .footerSection a:hover {
          color: white;
        }
        .footerLogo img {
          max-width: 120px;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .footTitle {
          font-size: 16px;
          font-weight: 600;
          color: white;
        }
        .orgName {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .orgAddress {
          font-size: 14px;
          color: #ccc;
        }
        .footerBottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px 20px;
          background-color: #1b2432;
        }
        .copyrighttitle {
          color: #bbb;
          font-size: 13px;
          margin: 0;
        }
        .social-icon {
          font-size: 18px;
          color: white;
          margin-left: 10px;
          transition: color 0.3s;
        }
        .social-icon:hover {
          color: #00acee;
        }
      `}</style>
      <footer className="footerSection">
        <div className="container-fluid py-3 p-0">
          <div className="row mx-auto justify-content-start gap-lg-5">
            {/* Logo & Address */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="footerLogo">
                <Image src="https://i.postimg.cc/rsKZhQbz/image.png" alt="EduVerse" width={120} height={120} />
              </div>
              <div className="orgName">EduVerse Network</div>
            </div>
            {/* Products */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <h4 className="footTitle my-3">Products</h4>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link href="/edu9">9th Class</Link>
                </li>
                <li className="mb-2">
                  <Link href="/edu10">10th Class</Link>
                </li>
                <li className="mb-2">
                  <Link href="/pcmb">Pcmb 11th Class</Link>
                </li>
                <li className="mb-2">
                  <Link href="/commerce">Commerce 11th Class</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footerBottom d-flex flex-wrap align-items-center justify-content-between">
          <p className="copyrighttitle">
            EduVerse Network. All Right Reserved, 2025
          </p>
          <div className="foot-social">
            <a
              href="https://www.youtube.com/@EduVerse_Network"
              className="social-icon"
              target="_blank"
            >
              <i className="bi bi-youtube"></i>
            </a>
            <a
              href="https://t.me/EduVerse_Network"
              className="social-icon"
              target="_blank"
            >
              <i className="bi bi-send-fill"></i>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
