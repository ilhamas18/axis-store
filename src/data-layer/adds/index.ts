let dataLayer: {
  event: string;
  gads_dy_convlabel?: string;
  tiktok_trigger_event?: string;
  meta_event?: string;
  meta_content_type?: string;
  twitter_event_id?: string;
  group_tag_string?: string;
  activity_tag_string?: string;
  ttd_adv_id?: string;
  ttd_map_id?: string;
}[] = [];
let fbTag = false;

if (typeof window !== "undefined") {
  dataLayer = window.dataLayer;
}
if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
  fbTag = true;
}
export const addsHomeLand = () => {
  dataLayer.push({
    event: "WM_SEM_Home_StoreAxis_Homepage_716680393",
    gads_dy_convlabel: "sDXXCLqhuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_Home_StoreAxis_Homepage_722271439",
    gads_dy_convlabel: "qYNvCITw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_TikTok_Home_StoreAxis_Homepage_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ViewContent",
  });
  dataLayer.push({
    event: "WM_FL_Home_StoreAxis_Homepage_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl00",
  });
  // console.log(dataLayer);
};

export const addsHomeAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_PesanKartuPerdana_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_PesanKartuPerdana_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_PesanKartuPerdana_Button_716680393",
    gads_dy_convlabel: "JXU4CL2huM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_PesanKartuPerdana_Button_722271439",
    gads_dy_convlabel: "f95qCIfw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_PesanKartuPerdana_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofonr",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_PesanKartuPerdana_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_PesanKartuPerdana_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl003",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_PesanKartuPerdana_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "b5ncxwp",
  });
  // console.log(dataLayer);
};

export const addsPilihLand = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step1Page_pageview_352649475647541",
      meta_event: "ViewContent",
    });
  }

  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step1Page_pageview_716680393",
    gads_dy_convlabel: "uEu5CMChuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step1Page_pageview_722271439",
    gads_dy_convlabel: "ukN_CIrw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step1Page_pageview_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ViewContent",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step1Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl000",
  });
  // console.log(dataLayer);
};
export const addsPilihAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step1Lanjutkan_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step1Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step1Lanjutkan_Button_716680393",
    gads_dy_convlabel: "5WybCMOhuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step1Lanjutkan_Button_722271439",
    gads_dy_convlabel: "T76tCI3w_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_Step1Lanjutkan_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofons",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step1Lanjutkan_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step1Lanjutkan_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl004",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step1Lanjutkan_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "rpriv06",
  });
  // console.log(dataLayer);
};
export const addsRegistrasiLand = () => {
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step2Page_pageview_716680393",
    gads_dy_convlabel: "pwHMCMahuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step2Page_pageview_722271439",
    gads_dy_convlabel: "6EcECJDw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step2Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl001",
  });
  // console.log(dataLayer);
};
export const addsRegistrasiAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step2Lanjutkan_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step2Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step2Lanjutkan_Button_716680393",
    gads_dy_convlabel: "fO58CMmhuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step2Lanjutkan_Button_722271439",
    gads_dy_convlabel: "jw4ZCJPw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_Step2Lanjutkan_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofont",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step2Lanjutkan_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step2Lanjutkan_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl005",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step2Lanjutkan_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "8tswmdd",
  });
  // console.log(dataLayer);
};
export const addsLayananPengirimanLand = () => {
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step3Page_pageview_716680393",
    gads_dy_convlabel: "DCU2CMyhuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step3Page_pageview_722271439",
    gads_dy_convlabel: "IVAQCJbw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step3Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl002",
  });
  // console.log(dataLayer);
};
export const addsLayananPengirimanAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step3Lanjutkan_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step3Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step3Lanjutkan_Button_716680393",
    gads_dy_convlabel: "1iXACM-huM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step3Lanjutkan_Button_722271439",
    gads_dy_convlabel: "e8QrCJnw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_Step3Lanjutkan_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofonu",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step3Lanjutkan_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step3Lanjutkan_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl006",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step3Lanjutkan_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "hmpj9to",
  });
  // console.log(dataLayer);
};
export const addsDetailPesananLand = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step4Page_pageview_352649475647541",
      meta_event: "AddToCart",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step4Page_pageview_716680393",
    gads_dy_convlabel: "U3wnCMqiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step4Page_pageview_722271439",
    gads_dy_convlabel: "O9lYCJzw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step4Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl003",
  });
  // console.log(dataLayer);
};
export const addsDetailPesananAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step4Lanjutkan_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step4Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step4Lanjutkan_Button_716680393",
    gads_dy_convlabel: "u36vCM2iuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step4Lanjutkan_Button_722271439",
    gads_dy_convlabel: "Yk__CJ_w_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_Step4Lanjutkan_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofonw",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step4Lanjutkan_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step4Lanjutkan_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl007",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step4Lanjutkan_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "aexr3h9",
  });
  // console.log(dataLayer);
};
export const addsPembayaranLand = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step5Page_pageview_352649475647541",
      meta_event: "ViewContent",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step5Page_pageview_716680393",
    gads_dy_convlabel: "xLXUCNCiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step5Page_pageview_722271439",
    gads_dy_convlabel: "7QzCCKLw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step5Page_pageview_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ViewContent",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step5Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl004",
  });
  // console.log(dataLayer);
};
export const addsPembayaranAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step5Lanjutkan_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step5Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step5Lanjutkan_Button_716680393",
    gads_dy_convlabel: "UVTgCNOiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step5Lanjutkan_Button_722271439",
    gads_dy_convlabel: "RnAdCKXw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_Step5Lanjutkan_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofony",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step5Lanjutkan_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step5Lanjutkan_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl008",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step5Lanjutkan_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "2idy3hl",
  });
  // console.log(dataLayer);
};
export const addsPaymentnLand = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_Step6Page_pageview_352649475647541",
      meta_event: "InitiateCheckout",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_Step6Page_pageview_716680393",
    gads_dy_convlabel: "kS6_CNaiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_Step6Page_pageview_722271439",
    gads_dy_convlabel: "eR74CKjw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_Step6Page_pageview_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "InitiateCheckout",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_Step6Page_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl005",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_Step6Page_pageview_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "4c9gy4c",
  });
  // console.log(dataLayer);
};
export const addsPaymentnAction = () => {
  if (fbTag) {
    dataLayer.push({
      event: "WM_meta_StoreAxis_CekStatusPembayaran_Button_352649475647541",
      meta_event: "Lead",
      meta_content_type: "WMFB_Axis_Step6Lanjutkan_button",
    });
  }
  dataLayer.push({
    event: "WM_SEM_StoreAxis_CekStatusPembayaran_Button_716680393",
    gads_dy_convlabel: "Dm13CNmiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_CekStatusPembayaran_Button_722271439",
    gads_dy_convlabel: "0WlqCKvw_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_Twitter_StoreAxis_CekStatusPembayaran_Button_o9f6u",
    twitter_event_id: "tw-o9f6u-ofonz",
  });
  dataLayer.push({
    event:
      "WM_TikTok_StoreAxis_CekStatusPembayaran_Button_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ClickButton",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_CekStatusPembayaran_Button_9572590",
    group_tag_string: "click0",
    activity_tag_string: "wm_fl009",
  });
  dataLayer.push({
    event: "WM_TTD_StoreAxis_CekStatusPembayaran_Button_4ozbxpt",
    ttd_adv_id: "4ozbxpt",
    ttd_map_id: "jz8d3pk",
  });

  // console.log(dataLayer);
};

export const addsProcessLand = () => {
  dataLayer.push({
    event: "WM_SEM_StoreAxis_StatusProses_pageview_716680393",
    gads_dy_convlabel: "Om2LCNyiuM8YEMnZ3tUC",
  });
  dataLayer.push({
    event: "WM_GADS-DYT_StoreAxis_StatusProses_pageview_722271439",
    gads_dy_convlabel: "e3L3CK7w_M4YEM_5s9gC",
  });
  dataLayer.push({
    event: "WM_TikTok_StoreAxis_StatusProses_pageview_CHMT8UBC77U8RIVSUDD0",
    tiktok_trigger_event: "ViewContent",
  });
  dataLayer.push({
    event: "WM_FL_StoreAxis_StatusProses_pageview_9572590",
    group_tag_string: "pagev0",
    activity_tag_string: "wm_fl006",
  });
  // console.log(dataLayer);
};
