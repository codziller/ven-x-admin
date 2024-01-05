import PropTypes from "prop-types";
import { IS_DEV } from "utils/appConstant";
import { ReactComponent as Logo } from "assets/logos/logo-purple.svg";
import { OnboardingDefaultWrapper } from "./style";

export default function Index({ children }) {
  return (
    <OnboardingDefaultWrapper
      className={`${
        IS_DEV ? "h-with-test-banner" : "h-screen w-screen"
      } bg-white`}
    >
      <div className="default-content">
        <div className="beautyhut-logo-container flex flex-col items-center justify-center mb-3 gap-2">
          <span className="scale-150">
            <Logo />
          </span>
          <span className="text-sm bg-blue-clear3 px-5 py-0.5 font-semibold">
            admin
          </span>
        </div>
        {children}
      </div>
    </OnboardingDefaultWrapper>
  );
}

Index.propTypes = {
  children: PropTypes.elementType,
};
