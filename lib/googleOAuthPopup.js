const POPUP_NAME = 'compliantscan-google-sign-in';

export async function signInWithGooglePopup(supabase) {
  const redirectTo = `${window.location.origin}/auth/callback?popup=1`;
  const width = 520;
  const height = 680;
  const left = Math.max(0, window.screenX + (window.outerWidth - width) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - height) / 2);

  const popup = window.open(
    '',
    POPUP_NAME,
    `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`,
  );

  if (!popup) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
    return null;
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data?.url) {
    popup.close();
    throw error || new Error('Google sign-in could not be started.');
  }

  popup.location.replace(data.url);

  return new Promise((resolve, reject) => {
    let settled = false;
    let closedChecks = 0;
    let pollTimer;
    let timeoutTimer;

    const finish = (callback) => {
      if (settled) return;
      settled = true;
      window.clearInterval(pollTimer);
      window.clearTimeout(timeoutTimer);
      window.removeEventListener('message', handleMessage);
      if (!popup.closed) popup.close();
      callback();
    };

    const checkSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        finish(() => resolve(sessionData.session));
        return;
      }
      if (popup.closed) {
        closedChecks += 1;
        if (closedChecks >= 4) {
          finish(() => reject(new Error('Google sign-in was cancelled.')));
        }
      }
    };

    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'compliantscan:auth-error') {
        finish(() => reject(new Error(event.data.message || 'Google sign-in could not be completed.')));
      } else if (event.data?.type === 'compliantscan:auth-complete') {
        checkSession();
      }
    };

    window.addEventListener('message', handleMessage);
    pollTimer = window.setInterval(checkSession, 500);
    timeoutTimer = window.setTimeout(() => {
      finish(() => reject(new Error('Google sign-in took too long. Please try again.')));
    }, 120000);
  });
}
