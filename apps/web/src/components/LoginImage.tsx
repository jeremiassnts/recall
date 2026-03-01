import Image from "next/image";
import logoWhite from "../../public/logo-white.webp";

export function LoginImage() {
    return (
        <section className="relative bg-[url('/login-background.webp')] bg-cover bg-center">
            <div aria-hidden="true" className="absolute inset-0 bg-black/30" />
            <Image src={logoWhite} alt="Recall" className="absolute top-4 left-4" width={100} height={100} />
        </section>
    );
}