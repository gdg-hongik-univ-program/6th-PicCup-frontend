import logoImage from '../assets/piccup-logo.png';

const SplashPage = () => {
  return (
    <main className="flex min-h-dvh items-center justify-center px-6 pb-20">
      <div className="flex flex-col items-center">
        <img
          src={logoImage}
          alt="PicCup 로고"
          className="h-20 w-auto object-contain"
        />

        <h1 className="mt-3 font-logo text-4xl">
          PicCup
        </h1>

        <p className="mt-7 text-sm text-text-secondary">
          당신의 순간을 Pick 하세요.
        </p>
      </div>
    </main>
  );
};

export default SplashPage;