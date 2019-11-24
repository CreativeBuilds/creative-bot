import * as React from 'react';
import { User } from '@/renderer/helpers/db/db';
import {
  PopupDialog,
  PopupDialogTitle,
  PopupDialogExitIcon,
  PopupDialogText,
  PopupButtonWrapper,
  PopupDialogInputWrapper,
  PopupDialogInputName,
  PopupDialogInput,
  PopupDialogInputInfo,
  PopupDialogTabHeaderWrapper,
  PopupDialogTabWrapper,
  PopupDialogTabPage,
  PopupDialogTab
} from '../generic-styled-components/popupDialog';
import { FaTimes } from 'react-icons/fa';
import { getPhrase } from '@/renderer/helpers/lang';
import { Button } from '../generic-styled-components/button';
import { rxConfig, updateConfig } from '@/renderer/helpers/rxConfig';
import { filter, first } from 'rxjs/operators';
import { IConfig } from '@/renderer';
import { config } from 'rxjs';

interface IProps {
  closePopup: Function;
}

/**
 * @descritpion Edit user popup
 */
export const UserSettingsPopup = (props: IProps) => {
  const [payoutRate, setPayoutRate] = React.useState(5);
  const [payoutAmount, setPayoutAmount] = React.useState(5);

  const [perLemon, setPerLemon] = React.useState(1);
  const [perIcecream, setPerIcecream] = React.useState(1);
  const [perDiamond, setPerDiamond] = React.useState(1);
  const [perNinjaghini, setPerNinjaghini] = React.useState(1);
  const [perNinjet, setPerNinjet] = React.useState(1);

  const [loading, setLoading] = React.useState(true);
  const [oldConfig, setOldConfig] = React.useState<Partial<IConfig>>({});
  const [oldDonationSettings, setOldDonationSettings] = React.useState<
    Partial<IConfig['donationSettings']>
  >({});

  const saveConfig = () => {
    updateConfig({
      points: payoutAmount,
      pointsTimer: Math.floor(payoutRate * 60),
      donationSettings: {
        lemons: perLemon,
        icecream: perIcecream,
        diamond: perDiamond,
        ninja: perNinjaghini,
        ninjet: perNinjet
      }
    })
      .then(() => {
        props.closePopup();
      })
      .catch(null);
  };

  const [tab, setTab] = React.useState<string>('points');

  React.useEffect(() => {
    const listener = rxConfig
      .pipe(
        filter(x => !!x),
        first()
      )
      .subscribe((config: Partial<IConfig>) => {
        if (!config) {
          return;
        }

        const donationSettings: IConfig['donationSettings'] = {
          ...config.donationSettings
        };
        setPayoutRate(Math.floor((config.pointsTimer || 300) / 60));
        setPayoutAmount(config.points !== undefined ? config.points : 5);
        setPerLemon(donationSettings.lemons !== undefined ? donationSettings.lemons : 1);
        setPerIcecream(donationSettings.icecream !== undefined ? donationSettings.icecream : 10);
        setPerDiamond(donationSettings.diamond !== undefined ? donationSettings.diamond : 100);
        setPerNinjaghini(donationSettings.ninja !== undefined ? donationSettings.ninja : 1000);
        setPerNinjet(donationSettings.ninjet !== undefined ? donationSettings.ninjet : 10000);

        setLoading(false);
        setOldConfig(config);
        setOldDonationSettings(donationSettings);
      });

    return () => {
      listener.unsubscribe();
    };
  }, []);

  const hasChanged = (): boolean => {
    return (
      payoutRate !==
      (!!oldConfig.pointsTimer
        ? Math.floor(oldConfig.pointsTimer / 60)
        : 1) ||
      payoutAmount !== oldConfig.points ||
      perLemon !== { ...oldDonationSettings }.lemons ||
      perIcecream !== { ...oldDonationSettings }.icecream ||
      perDiamond !== { ...oldDonationSettings }.diamond ||
      perNinjaghini !== { ...oldDonationSettings }.ninja ||
      perNinjet !== { ...oldDonationSettings }.ninjet
    );
  };

  const close = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    props.closePopup();
  };

  const updatePayoutRate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayoutRate(Number(e.target.value));
  };

  const updatePayoutAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayoutAmount(Number(e.target.value));
  };

  const updatePerLemon = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerLemon(Number(e.target.value));
  };
  const updatePerIcecream = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerIcecream(Number(e.target.value));
  };
  const updatePerDiamond = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerDiamond(Number(e.target.value));
  };
  const updatePerninjaghini = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerNinjaghini(Number(e.target.value));
  };
  const updatePerNinjet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPerNinjet(Number(e.target.value));
  };

  const goToPoints = () => {
    setTab('points');
  };
  const goToExp = () => {
    setTab('exp');
  };
  const isPage = (type: string): boolean => tab === type;

  return (
    <PopupDialog
      style={{
        height: 'min-content',
        width: '425px',
        minWidth: '425px'
      }}
    >
      <PopupDialogExitIcon>
        <FaTimes onClick={close}></FaTimes>
      </PopupDialogExitIcon>
      <PopupDialogTitle>
        {getPhrase('users_settings_popup_title')}
      </PopupDialogTitle>
      <PopupDialogTabWrapper style={{ marginBottom: '10px' }}>
        <PopupDialogTabHeaderWrapper>
          <PopupDialogTab
            onClick={isPage('points') ? () => null : goToPoints}
            selected={isPage('points')}
          >
            Points
          </PopupDialogTab>
          {/* <PopupDialogTab
            onClick={isPage('exp') ? () => null : goToExp}
            selected={isPage('exp')}
          >
            Exp
          </PopupDialogTab> */}
        </PopupDialogTabHeaderWrapper>
        <PopupDialogTabPage
          style={{
            boxShadow: '2px 2px 4px rgba(0,0,0,0.15)'
            // borderTopRightRadius: '0px'
          }}
        >
          {isPage('points') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_payoutrate_title')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={payoutRate}
                  min={1}
                  type='number'
                  onChange={updatePayoutRate}
                />
                <PopupDialogInputInfo>
                  {getPhrase(
                    'users_settings_popup_payoutrate_description',
                    payoutRate
                  )}
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_payoutamount_title')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={payoutAmount}
                  min={0}
                  type='number'
                  onChange={updatePayoutAmount}
                />
                <PopupDialogInputInfo>
                  {getPhrase(
                    'users_settings_popup_payoutamount_description',
                    payoutAmount,
                    'points'
                  )}
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_perlemon_title', 'Points')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={perLemon}
                  min={1}
                  type='number'
                  onChange={updatePerLemon}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase(
                    'users_settings_popup_pericecream_title',
                    'Points'
                  )}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={perIcecream}
                  min={1}
                  type='number'
                  onChange={updatePerIcecream}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_perdiamond_title', 'Points')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={perDiamond}
                  min={1}
                  type='number'
                  onChange={updatePerDiamond}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase(
                    'users_settings_popup_perninjaghini_title',
                    'Points'
                  )}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={perNinjaghini}
                  min={1}
                  type='number'
                  onChange={updatePerninjaghini}
                />
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_perninjet_title', 'Points')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={perNinjet}
                  min={1}
                  type='number'
                  onChange={updatePerNinjet}
                />
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : isPage('exp') ? (
            <React.Fragment>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_payoutrate_title')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={payoutRate}
                  min={1}
                  type='number'
                  onChange={updatePayoutRate}
                />
                <PopupDialogInputInfo>
                  {getPhrase(
                    'users_settings_popup_payoutrate_description',
                    payoutRate
                  )}
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
              <PopupDialogInputWrapper>
                <PopupDialogInputName>
                  {getPhrase('users_settings_popup_payoutamount_title')}
                </PopupDialogInputName>
                <PopupDialogInput
                  value={payoutAmount}
                  min={0}
                  type='number'
                  onChange={updatePayoutAmount}
                />
                <PopupDialogInputInfo>
                  {getPhrase(
                    'users_settings_popup_payoutamount_description',
                    payoutAmount,
                    'points'
                  )}
                </PopupDialogInputInfo>
              </PopupDialogInputWrapper>
            </React.Fragment>
          ) : null}
        </PopupDialogTabPage>
      </PopupDialogTabWrapper>

      <PopupButtonWrapper>
        <Button
          disabled={!hasChanged()}
          onClick={hasChanged() ? saveConfig : () => null}
          style={{ zIndex: 4, position: 'static' }}
        >
          {getPhrase('users_settings_save')}
        </Button>
      </PopupButtonWrapper>
    </PopupDialog>
  );
};
