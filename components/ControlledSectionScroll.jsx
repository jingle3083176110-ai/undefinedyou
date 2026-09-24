"use client";

import { useEffect, useRef } from "react";
import { useFullPage } from "@alvalens/react-fullpage-snap";

const SCROLL_THRESHOLD = 48;
const GESTURE_SETTLE_MS = 980;

export default function ControlledSectionScroll() {
	const { activeIndex, moveTo, totalSections } = useFullPage();
	const locked = useRef(false);
	const delta = useRef(0);
	const resetTimer = useRef(null);

	useEffect(() => {
		const resetDelta = () => {
			delta.current = 0;
		};

		const handleWheel = (event) => {
			event.preventDefault();
			if (locked.current) return;

			delta.current += event.deltaY;
			if (resetTimer.current) window.clearTimeout(resetTimer.current);
			resetTimer.current = window.setTimeout(resetDelta, 180);

			if (Math.abs(delta.current) < SCROLL_THRESHOLD) return;

			const direction = delta.current > 0 ? 1 : -1;
			const nextIndex = activeIndex + direction;
			resetDelta();
			if (nextIndex < 0 || nextIndex >= totalSections) return;

			locked.current = true;
			moveTo(nextIndex);
			window.setTimeout(() => {
				locked.current = false;
			}, GESTURE_SETTLE_MS);
		};

		window.addEventListener("wheel", handleWheel, { passive: false });
		return () => {
			window.removeEventListener("wheel", handleWheel);
			if (resetTimer.current) window.clearTimeout(resetTimer.current);
		};
	}, [activeIndex, moveTo, totalSections]);

	return null;
}
