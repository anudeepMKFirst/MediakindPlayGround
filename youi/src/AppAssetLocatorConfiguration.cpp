#include "AppAssetLocatorConfiguration.h"

#include <asset/YiAssetLoader.h>
#include <framework/YiFramework.h>
#include <platform/YiDeviceBridgeLocator.h>

AppAssetLocatorConfiguration &AppAssetLocatorConfiguration::GetInstance()
{
    static AppAssetLocatorConfiguration assetLocatorConfiguration;

    return assetLocatorConfiguration;
}

AppAssetLocatorConfiguration::AppAssetLocatorConfiguration()
{
}

AppAssetLocatorConfiguration::~AppAssetLocatorConfiguration()
{
}

void AppAssetLocatorConfiguration::SetupAssetLocatorConfiguration(const CYIString &formFactor)
{
    Reset();
    m_assetLocator.ClearConfigurationProperties();
    m_assetLocator.SetBase(CYIFramework::GetInstance()->GetAssetLoader()->GetAssetLocator().GetBase());
    m_assetLocator.AddConfigurationProperty(std::make_unique<AppDebugFormFactorConfiguration>(formFactor), CYIAssetLocator::Priority::Highest);

    RefreshConfiguration();
}

void AppAssetLocatorConfiguration::Reset()
{
    m_assetLocator = CYIAssetLocator();
}

void AppAssetLocatorConfiguration::RefreshConfiguration()
{
    m_assetLocator.Refresh();

    CYIFramework::GetInstance()->GetAssetLoader()->SetAssetLocator(m_assetLocator);
}
