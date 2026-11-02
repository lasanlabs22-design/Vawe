// Pure-CSS intro curtain; hidden on repeat visits via the `intro-seen` class set in layout.
export default function Preloader() {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="preloader-mark" src="/brand/vawe-mark.png" alt="" />
        <div className="preloader-word">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/vawe-wordmark-light.png" alt="" />
        </div>
        <div className="preloader-bar">
          <span />
        </div>
      </div>
    </div>
  );
}
