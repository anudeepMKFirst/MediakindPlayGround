// © You i Labs Inc. 2000-2019. All rights reserved.
#include "App.h"
#include "AppAssetLocatorConfiguration.h"

#include <cxxreact/JSBigString.h>
#include <glog/logging.h>

#if defined(YI_LOCAL_JS_APP)
#    if defined(YI_INLINE_JS_APP)
#        include "youireact/JsBundleLoaderInlineString.h"
const char INLINE_JS_BUNDLE_STRING[] =
#        include "InlineJSBundleGenerated/index.youi.bundle"
    ;
#    else
#        include "youireact/JsBundleLoaderLocalAsset.h"
#    endif
#else
#    include "youireact/JsBundleLoaderRemote.h"
#endif
#include <appium/YiWebDriverLocator.h>

#include <YiCloudModule.h>

#if (YI_CLOUD_SERVER)
#    include <YiCloudConfigModule.h>
#    include <cloud/YiCloud.h>
#endif

App::App() = default;

App::~App() = default;

using namespace yi::react;

bool App::UserInit()
{
    // Start the web driver for allowing the use of Appium.
    CYIWebDriver *pWebDriver = CYIWebDriverLocator::GetWebDriver();
    if (pWebDriver)
    {
        pWebDriver->Start();
    }

#if !defined(YI_MINI_GLOG)
    // miniglog defines this using a non-const char * causing a compile error and it has no implementation anyway.
    static bool isGoogleLoggingInitialized = false;
    if (!isGoogleLoggingInitialized)
    {
        google::InitGoogleLogging("--logtostderr=1");
        isGoogleLoggingInitialized = true;
    }
#endif

    //AppAssetLocatorConfiguration::GetInstance().SetupAssetLocatorConfiguration("Handset");
    AppAssetLocatorConfiguration::GetInstance().SetupAssetLocatorConfiguration("TV");

#if defined(YI_LOCAL_JS_APP)
#    if defined(YI_INLINE_JS_APP)
    std::unique_ptr<JsBundleLoader> pBundleLoader = std::make_unique<JsBundleLoaderInlineString>(INLINE_JS_BUNDLE_STRING);
#    else
    std::unique_ptr<JsBundleLoader> pBundleLoader = std::make_unique<JsBundleLoaderLocalAsset>();
#    endif
#else
    std::unique_ptr<JsBundleLoader> pBundleLoader(new JsBundleLoaderRemote());
#endif

    PlatformApp::SetJsBundleLoader(std::move(pBundleLoader));

    bool userInitSuccess = PlatformApp::UserInit();

    GetReactNativeViewController().AddModule<Cloud>();

#if YI_CLOUD_SERVER
    GetReactNativeViewController().AddModule<CloudConfig>();
#endif

    return userInitSuccess;
}

bool App::UserStart()
{
    bool isOK = PlatformApp::UserStart();
#ifdef YI_CLOUD_SAVESTATE_FEATURE
    CYICloud::GetInterface().SetNavigationPersistenceKey("NavigationState");
#endif
    return isOK;
}

void App::UserUpdate()
{
    PlatformApp::UserUpdate();
}
