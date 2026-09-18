function LockIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true" focusable="false">
      <path d="M6.5 10V7a5.5 5.5 0 0 1 11 0v3M5 10h14v11H5V10Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Ending() {
  return (
    <section id="ending" className="relative block min-h-svh bg-commerce-purple text-commerce-cream" aria-labelledby="ending-title">
      <div className="relative block min-h-svh">
        <div className="absolute top-[29%] left-1/2 w-[min(531px,calc(100%-48px))] -translate-x-1/2 text-center phone:top-[28%]">
          <p className="text-[16px] leading-6 font-medium tracking-wider text-white uppercase">Next chapter</p>
          <h2 className="sr-only" id="ending-title">Commerce Trends in Africa</h2>
          <p className="mt-6.5 mb-6.75 text-[18px] leading-[1.8] font-medium text-white phone:text-[16px]">A look at some of the biggest trends observed from our vantage point as one of the largest online payment service providers in Africa&apos;s largest market. </p>
          <div className="mx-auto flex min-h-15.75 w-91.5 max-w-full items-center justify-between rounded-xl border-0 bg-commerce-cream p-4 text-commerce-dark-green"><span className="text-[18px] font-semibold phone:text-[16px]">Commerce Trends in Africa</span><LockIcon /></div>
          <p className="mt-3 text-[13px] text-white">This chapter is not available in this preview.</p>
        </div>
        <a className="absolute right-10 bottom-6.25 text-white" href="#top">Back to the beginning ↑</a>
      </div>
    </section>
  );
}
