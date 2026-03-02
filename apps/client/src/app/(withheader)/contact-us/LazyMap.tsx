"use client";

import { useEffect, useRef, useState } from "react";

export function LazyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="h-[400px] w-full bg-gray-200" ref={ref}>
      {show && (
        <iframe
          allowFullScreen
          height="100%"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3455.936669986666!2d79.1356783151129!3d29.4166669823029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a19f6f6f6f6f7%3A0x6f6f6f6f6f6f6f6f!2sManu%20Maharani%20Resort%20%26%20Spa!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
          style={{ border: 0 }}
          title="Manu Maharani Resort location"
          width="100%"
        />
      )}
    </section>
  );
}
