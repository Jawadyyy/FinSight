import { FANNED } from './landing-data';

/** The signature visual: parsed transactions fanned out like a hand of cards,
 *  cropped by the fold below the hero. */
export function FannedCards() {
  return (
    <div className="relative mx-auto mt-16 h-[260px] max-w-4xl sm:h-[300px]" aria-hidden>
      {FANNED.map((row, i) => {
        const middle = (FANNED.length - 1) / 2;
        const offset = i - middle;
        return (
          // Two elements on purpose: the wrapper holds the fan position, the
          // card holds the entrance. A keyframe that animates transform
          // outranks an inline transform, so one element cannot do both — the
          // cards would stack in the centre instead of fanning out.
          <div
            key={row.merchant}
            // The outermost pair is barely on screen at phone widths, so the
            // fan drops to three rather than showing two slivers.
            className={`absolute left-1/2 top-0 ${
              Math.abs(offset) === 2 ? 'hidden sm:block' : ''
            }`}
            style={{
              transform: `translateX(-50%) translateX(${offset * 132}px) translateY(${Math.abs(offset) * 26}px) rotate(${offset * 9}deg)`,
              zIndex: 10 - Math.abs(offset),
            }}
          >
            <article
              className="deal w-[186px] rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md sm:w-[210px]"
              style={{ animationDelay: `${240 + i * 70}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/60">
                  Aug 2026
                </span>
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: row.tint }}
                />
              </div>

              <p className="font-display mt-6 text-2xl font-bold text-white">
                {row.amount}
              </p>
              <p className="text-[11px] font-medium text-white/55">PKR</p>

              <p className="mt-5 truncate text-sm font-semibold text-white">
                {row.merchant}
              </p>
              <span
                className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                style={{ backgroundColor: row.tint }}
              >
                {row.category}
              </span>
            </article>
          </div>
        );
      })}
    </div>
  );
}
