export default function AboutSection() {
  return (
    <section className="w-full mb-10 flex justify-center items-center">
      <div
        className="max-w-screen-xl mx-auto bg-gray-50 text-gray-800 py-24 flex flex-col justify-center items-center bg-cover bg-center relative"
        style={{
          backgroundAttachment: "fixed",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-80 z-0"></div>
        <div className="text-center px-16 relative z-10">
          <h2 className="text-2xl md:text-4xl  tracking-[0.08em] uppercase mb-10 leading-snug text-white">
            Luxury Grounded in Tradition: A Warm Indian Welcome
          </h2>
          <p className="text-sm md:text-base font-serif text-gray-200 leading-relaxed">
            At Manu Maharani, we honor the timeless philosophy of Atithi Devo
            Bhavah—where every guest is treated as a divine presence. This is
            more than a luxury resort; it is a sanctuary of warm hospitality
            where modern sophistication meets traditional Indian grace. Whether
            you are walking the pebble-strewn banks of the Kosi or enjoying a
            quiet moment on our manicured lawns with the Shivalik hills as your
            backdrop, our team is dedicated to crafting a stay that feels both
            grand and deeply personal.
          </p>
          <button className="mt-8 border border-white bg-transparent text-white px-8 py-3 uppercase tracking-widest font-medium text-base hover:bg-black hover:text-[#b68833] hover:border-[#b68833] transition">
            Discover Our Sanctuary
          </button>
        </div>
      </div>
    </section>
  );
}
