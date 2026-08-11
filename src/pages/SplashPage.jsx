import logoImage from '../assets/piccup-logo.png';

const SplashPage = () => {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center px-6">
      <img
        src={logoImage}
        alt="PicCup 로고"
        className="h-20 w-auto object-contain"
      />

      <h1 className="mt-3 font-logo text-4xl">
        PicCup
      </h1>

      <p className="mt-8 text-sm text-text-secondary">
        당신의 픽을 픽하세요
      </p>
    </section>
  );
};

export default SplashPage;