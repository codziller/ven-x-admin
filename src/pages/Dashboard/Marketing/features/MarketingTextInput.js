import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "components/General/Button/Button";
import Textarea from "components/General/Textarea/Textarea";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import ImagePicker from "components/General/Input/ImagePicker";
import { MEDIA_MODAL_TYPES } from "utils/appConstant";
import Input from "components/General/Input/Input";
import { isArray, isEmpty } from "lodash";

import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import cleanPayload from "utils/cleanPayload";
import CheckBox from "components/General/Input/CheckBox";
import { errorToast } from "components/General/Toast/Toast";

const { BRAND, PRODUCT } = MEDIA_MODAL_TYPES;

const Form = observer(() => {
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  const schema = yup.object({});

  const { editMarketingText, marketingText, loadingMarketingText } =
    MarketingStore;

  const defaultValues = {
    donationDescriptionText: marketingText?.donationDescriptionText || "",
    donationImageUrl: marketingText?.donationImageUrl || [],
    donationTitleText: marketingText?.donationTitleText || "",
    donationUrlToLinkTo: marketingText?.donationUrlToLinkTo || "",
    appOrderDiscountText: marketingText?.appOrderDiscountText || "",
    emailExclusiveText: marketingText?.emailExclusiveText || "",
    freeShippingText: marketingText?.freeShippingText || "",
    loyaltyText: marketingText?.loyaltyText || "",
    appOrderDiscountTextVisibility:
      !!marketingText?.appOrderDiscountTextVisibility,
    emailExclusiveTextVisibility: !!marketingText?.emailExclusiveTextVisibility,
    freeShippingTextVisibility: !!marketingText?.freeShippingTextVisibility,
    loyaltyTextVisibility: !!marketingText?.loyaltyTextVisibility,

    appVersionAndroidText: marketingText?.appVersionAndroidText || "",
    appVersionButtonLink: marketingText?.appVersionButtonLink || "",
    appVersionButtonText: marketingText?.appVersionButtonText || "",
    appVersionHeaderText: marketingText?.appVersionHeaderText || "",
    appVersionIosText: marketingText?.appVersionIosText || "",
    appVersionMainText: marketingText?.appVersionMainText || "",
    appVersionSkipBool: !!marketingText?.appVersionSkipBool,
    appVersionSkipText: marketingText?.appVersionSkipText || "",
    appVersionWhatsNewText: marketingText?.appVersionWhatsNewText || "",
    appExploreImageUrl: marketingText?.appExploreImageUrl || [],
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleChange = async ({ prop, val }) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    donationDescriptionText: watch("donationDescriptionText"),
    donationImageUrl: watch("donationImageUrl"),
    donationUrlToLinkTo: watch("donationUrlToLinkTo"),
    donationTitleText: watch("donationTitleText"),
    appOrderDiscountText: watch("appOrderDiscountText"),
    emailExclusiveText: watch("emailExclusiveText"),
    freeShippingText: watch("freeShippingText"),
    loyaltyText: watch("loyaltyText"),

    appOrderDiscountTextVisibility: watch("appOrderDiscountTextVisibility"),
    emailExclusiveTextVisibility: watch("emailExclusiveTextVisibility"),
    freeShippingTextVisibility: watch("freeShippingTextVisibility"),
    loyaltyTextVisibility: watch("loyaltyTextVisibility"),

    appExploreImageUrl: watch("appExploreImageUrl"),
    appVersionAndroidText: watch("appVersionAndroidText"),
    appVersionButtonLink: watch("appVersionButtonLink"),
    appVersionButtonText: watch("appVersionButtonText"),
    appVersionHeaderText: watch("appVersionHeaderText"),
    appVersionIosText: watch("appVersionIosText"),
    appVersionMainText: watch("appVersionMainText"),
    appVersionSkipBool: watch("appVersionSkipBool"),
    appVersionSkipText: watch("appVersionSkipText"),
    appVersionWhatsNewText: watch("appVersionWhatsNewText"),
  };

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.donationImageUrl)
          ? form?.donationImageUrl?.[0]
          : form?.donationImageUrl
      );

      const exploreImagesUrls = await uploadImageToCloud(
        isArray(form?.appExploreImageUrl)
          ? form?.appExploreImageUrl?.[0]
          : form?.appExploreImageUrl
      );
      const payload = {
        ...form,
        donationImageUrl: imagesUrls,
        appExploreImageUrl: exploreImagesUrls,
      };

      cleanPayload(payload);

      await editMarketingText({
        data: payload,
      });
    } catch (error) {
      console.log("imagesUrls error: ", error);
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  return loadingMarketingText ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="w-full h-full">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <span className="text-grey-text text-lg uppercase">
                      App Version
                    </span>
                    <span className="text-grey-text text-sm">
                      Provide details of the app version
                    </span>
                  </div>

                  <Textarea
                    label="App Version Android Text"
                    value={form?.appVersionAndroidText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionAndroidText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionAndroidText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <Textarea
                    label="App Version Button Link"
                    value={form?.appVersionButtonLink}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionButtonLink", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionButtonLink}
                    showFormError={formTwo?.showFormError}
                    required
                  />
                  <Textarea
                    label="App Version Button Text"
                    value={form?.appVersionButtonText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionButtonText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionButtonText}
                    showFormError={formTwo?.showFormError}
                    required
                  />
                  <Textarea
                    label="App Version Header Text"
                    value={form?.appVersionHeaderText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionHeaderText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionHeaderText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <Textarea
                    label="App Version Ios Text"
                    value={form?.appVersionIosText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionIosText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionIosText}
                    showFormError={formTwo?.showFormError}
                    required
                  />
                  <Textarea
                    label="App Version Main Text"
                    value={form?.appVersionMainText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionMainText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionMainText}
                    showFormError={formTwo?.showFormError}
                    required
                  />
                  <Textarea
                    label="App Version Skip Text"
                    value={form?.appVersionSkipText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionSkipText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionSkipText}
                    showFormError={formTwo?.showFormError}
                    required
                  />

                  <Textarea
                    label="App Version Whats New Text"
                    value={form?.appVersionWhatsNewText}
                    onChangeFunc={(val) =>
                      handleChange({ prop: "appVersionWhatsNewText", val })
                    }
                    placeholder="Enter Text"
                    formError={errors.appVersionWhatsNewText}
                    showFormError={formTwo?.showFormError}
                    required
                  />
                  <CheckBox
                    label="Skip App Version Update"
                    onChange={() =>
                      handleChange({
                        prop: "appVersionSkipBool",
                        val: !form.appVersionSkipBool,
                      })
                    }
                    checked={form?.appVersionSkipBool}
                  />

                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text="Save Changes"
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === BRAND}
        details={{ prop: "dataId", modalType: BRAND }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
      <DetailsModal
        active={formTwo?.modalType === PRODUCT}
        details={{ prop: "dataId", modalType: PRODUCT }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
      />
    </>
  );
});

const AddHomePageSlider = () => {
  const { loadingMarketingText, getMarketingText, marketingText } =
    MarketingStore;

  useEffect(() => {
    // getMarketingText();
  }, []);
  return loadingMarketingText ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePageSlider);
