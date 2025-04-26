import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage, type AuthProvider } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import BgVideo from "../../assets/LoginVideo.mp4";
import EmprendePlusLogo from "../../components/Logos/EmprendePlusLogo";
import UTPLogo from "../../components/Logos/UTPLogo";
import FiscLogo from "../../components/Logos/FiscLogo";

const BRANDING = {
  logo: (
    <div className="text-blue-500 z-10 w-20">
      <EmprendePlusLogo />
    </div>
  ),

  title: "Emprende+",
};

// preview-start
const providers = [{ id: "credentials", name: "Email and Password" }];
// preview-end

const signIn: (provider: AuthProvider, formData: FormData) => void = async (
  provider,
  formData
) => {
  const promise = new Promise<void>((resolve) => {
    setTimeout(() => {
      alert(
        `Signing in with "${provider.name}" and credentials: ${formData.get(
          "email"
        )}, ${formData.get("password")}`
      );
      resolve();
    }, 300);
  });
  return promise;
};

export default function CredentialsSignInPage() {
  const theme = useTheme();
  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <video
        className="fixed object-cover -z-1 w-full h-full"
        autoPlay
        loop
        muted
        preload="none"
        playsInline
      >
        <source src={BgVideo} type="video/mp4" />
      </video>
      <div className="fixed z-20 top-3 left-10 flex justify-center items-center gap-6">
        <div className="w-20">
          <UTPLogo />
        </div>
        <div className="w-20 fill-green-700">
          <FiscLogo />
        </div>
        <div className="flex flex-col text-white">
          <span className="text-xl text-white">
            Universidad Tecnológica de Panamá
          </span>
          <span>Facultad de Ing. Sistemas y Computación</span>
        </div>
      </div>
      <div className="fixed top-1/2 transform translate-x-16 -translate-y-1/2 text-6xl text-white font-bold flex flex-col select-none leading-tight z-10">
        <span>Hazlo por ti.</span>
        <span>Aprende,</span>
        <span>Emprende,</span>
        <span>Y Vende</span>
      </div>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slotProps={{
          emailField: { autoFocus: false },
          form: { noValidate: false },
        }}
      />
    </AppProvider>
    // preview-end
  );
}
