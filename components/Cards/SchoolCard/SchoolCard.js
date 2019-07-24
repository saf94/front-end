import React, { Component } from 'react';
import { arrayOf, bool, func, string, shape } from 'prop-types';
import classNames from 'classnames';
import Card from 'components/Cards/Card/Card';
import OnlineIcon from 'static/images/icons/Custom/online.svg';
import HousingIcon from 'static/images/icons/Custom/housing.svg';
import EquipmentIcon from 'static/images/icons/Custom/equipment.svg';
import MapMarkerIcon from 'static/images/icons/FontAwesome/map_marker_icon.svg';
import LinkButton from 'components/LinkButton/LinkButton';
import Button from 'components/Button/Button';
import Badge from 'components/Badge/Badge';
import ScreenReaderOnly from 'components/ScreenReaderOnly/ScreenReaderOnly';
import styles from './SchoolCard.css';

export const getSchoolLocationText = (hasOnlyOnline, locations) => {
  let locationText = 'Multiple locations';
  if (hasOnlyOnline) {
    locationText = 'Online only';
  } else if (locations.length === 1) {
    const [location] = locations;
    locationText = `${location.city}, ${location.state}`;
  }

  return locationText;
};

// eslint-disable-next-line react/prop-types
const LabelWithScreenReader = ({ isActive, label }) => (
  <>
    <ScreenReaderOnly>{isActive ? 'Has ' : 'Does not have '}</ScreenReaderOnly>
    {label}
  </>
);

export default class SchoolCard extends Component {
  static propTypes = {
    hasHardwareIncluded: bool.isRequired,
    hasHousing: bool,
    hasOnline: bool.isRequired,
    hasOnlyOnline: bool.isRequired,
    isFullTime: bool.isRequired,
    locations: arrayOf(
      shape({
        city: string,
        vaAccepted: bool.isRequired,
        state: string,
      }),
    ).isRequired,
    logoSource: string.isRequired,
    name: string.isRequired,
    website: string.isRequired,
    toggleModal: func.isRequired,
  };

  static defaultProps = {
    hasHousing: false,
  };

  toggleModalClick = () => {
    const { name, locations, toggleModal } = this.props;
    toggleModal({ name, locations });
  };

  render() {
    const { props } = this;

    const hasGiBill = props.locations.some(location => location.vaAccepted);
    const hasManyLocations = props.locations.length > 1;

    // Only leveraged if !hasManyLocations
    const simpleLocationText = props.hasOnlyOnline
      ? 'School is remote. No physical campus exists!'
      : `Campus located in ${props.locations[0].city}, ${props.locations[0].state}`;

    const badgeClassNames = isActive =>
      classNames(styles.badgeGroupItem, { [styles.active]: isActive });

    return (
      <Card className={styles.SchoolCard} hasAnimationOnHover={false} data-testid="SchoolCard">
        {/* Clearly express code school name to screen readers */}
        <ScreenReaderOnly>
          <h6 data-testid={`SchoolCard Name: ${props.name}`}>{props.name}</h6>
        </ScreenReaderOnly>

        {hasGiBill && (
          <section className={styles.giBillRibbon} data-testid="GI Bill Ribbon">
            <ScreenReaderOnly>Accepts</ScreenReaderOnly> GI Bill
          </section>
        )}

        <section className={styles.cardBrand}>
          <img src={props.logoSource} alt={`${props.name} logo`} height="150" />
        </section>

        <section className={styles.cardBlock}>
          <div className={styles.badgeGroup}>
            <Badge
              label={
                <LabelWithScreenReader
                  label={props.hasOnline ? 'Remote Option' : 'No Remote'}
                  isActive={props.hasOnline}
                />
              }
              icon={
                <OnlineIcon
                  data-testid={props.hasOnline ? 'School has online' : 'School has no online'}
                />
              }
              className={badgeClassNames(props.hasOnline)}
            />

            <Badge
              label={
                <LabelWithScreenReader
                  label={props.hasHousing ? 'Housing Provided' : 'No Housing'}
                  isActive={props.hasHousing}
                />
              }
              icon={<HousingIcon />}
              className={badgeClassNames(props.hasHousing)}
            />
            <Badge
              label={
                <LabelWithScreenReader
                  label={props.hasHardwareIncluded ? 'Hardware Provided' : 'No Hardware'}
                  isActive={props.hasHardwareIncluded}
                />
              }
              icon={<EquipmentIcon />}
              className={badgeClassNames(props.hasHardwareIncluded)}
            />
          </div>
        </section>

        <section className={styles.cardBlock}>
          {hasManyLocations ? (
            <>
              <span>
                <MapMarkerIcon className={styles.mapMarkerIcon} />
                Many campuses...{' '}
              </span>
              <Button
                analyticsObject={{
                  action: 'Button Selected',
                  category: 'Interactions',
                  label: `${props.name} | Locations`,
                }}
                onClick={this.toggleModalClick}
                className={styles.modalToggler}
              >
                Show Locations
              </Button>
            </>
          ) : (
            <span>
              <MapMarkerIcon className={styles.mapMarkerIcon} /> {simpleLocationText}
            </span>
          )}
        </section>

        <section className={styles.cardBlock}>
          <LinkButton
            analyticsEventLabel={`${props.name} | Website`}
            href={props.website}
            fullWidth
            theme="secondary"
          >
            Visit Website
          </LinkButton>
        </section>
      </Card>
    );
  }
}
