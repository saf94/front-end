import { string } from 'prop-types';
import nextCookie from 'next-cookies';
import Head from 'components/head';
import Alert from 'components/Alert/Alert';
import Content from 'components/Content/Content';
import HeroBanner from 'components/HeroBanner/HeroBanner';
import LinkButton from 'components/LinkButton/LinkButton';
import withAuthSync from 'decorators/withAuthSync/withAuthSync';
import SocialLoginGroup from 'components/SocialLoginGroup/SocialLoginGroup';
import SocialLoginButtons from 'components/SocialLoginGroup/SocialLoginButtons';
import { connectSocial } from 'common/constants/api';
import styles from '../styles/profile.css';

class Profile extends React.Component {
  static async getInitialProps(ctx) {
    const { firstName, lastName } = nextCookie(ctx);
    return { firstName, lastName };
  }

  static propTypes = {
    firstName: string.isRequired,
    lastName: string.isRequired,
  };

  state = {
    alertMessage: '',
  };

  onLoginSocial = (provider, values) => {
    return connectSocial(provider, values);
  };

  onSocialConnection = () => {
    this.setState({ alertMessage: 'Successfully connected social account.' });
  };

  render() {
    const { firstName, lastName } = this.props;
    const { alertMessage } = this.state;

    return (
      <>
        <Head title="Profile" />

        <HeroBanner title="Profile" />

        <Content
          theme="gray"
          columns={[
            <p>
              Hello {firstName} {lastName}!
            </p>,
            <div className={styles.actionItems}>
              <LinkButton
                theme="secondary"
                href="/profile/update"
                shouldPrefetch
                className={styles.profileButton}
              >
                Update Profile
              </LinkButton>
              <LinkButton
                theme="secondary"
                href="/profile/change_password"
                shouldPrefetch
                className={styles.profileButton}
              >
                Change Password
              </LinkButton>
            </div>,
            <Alert isOpen={!!alertMessage} type="success">
              {alertMessage}
            </Alert>,
            <SocialLoginGroup
              handleSuccess={this.onSocialConnection}
              loginSocial={this.onLoginSocial}
            >
              {({ onSuccess, onGoogleFailure }) => (
                <div className={styles.centerText}>
                  <p>
                    Connect your account to a social media login. After connecting your social media
                    account, you’ll be able to login using that social media provider!
                  </p>
                  <SocialLoginButtons onSuccess={onSuccess} onGoogleFailure={onGoogleFailure} />
                </div>
              )}
            </SocialLoginGroup>,
          ]}
        />
      </>
    );
  }
}

export default withAuthSync(Profile);
