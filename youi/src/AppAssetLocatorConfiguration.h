#ifndef _APP_ASSET_LOCATOR_CONFIGURATION_H_
#define _APP_ASSET_LOCATOR_CONFIGURATION_H_

#include <asset/YiAbstractAssetConfiguration.h>
#include <asset/YiAssetLocator.h>
#include <utility/YiString.h>

class AppAssetLocatorConfiguration
{
public:
    static AppAssetLocatorConfiguration &GetInstance();

    AppAssetLocatorConfiguration();
    virtual ~AppAssetLocatorConfiguration();

    void SetupAssetLocatorConfiguration(const CYIString &formFactor);

private:
    void Reset();
    void RefreshConfiguration();

    void SetupCloudAssetLocatorConfiguration();

    CYIAssetLocator m_assetLocator;
};

class AppDebugFormFactorConfiguration : public CYIAbstractAssetConfiguration
{
public:
    AppDebugFormFactorConfiguration(CYIString formFactor)
    {
        m_qualifierValues.push_back(formFactor);
    }

    virtual std::unique_ptr<CYIAbstractAssetConfiguration> Clone() const
    {
        return std::make_unique<AppDebugFormFactorConfiguration>(*this);
    }

    uint32_t Test(const CYIString &name) const
    {
        if (name == m_qualifierValues.front())
        {
            return 1;
        }

        return 0;
    }
};

#endif
