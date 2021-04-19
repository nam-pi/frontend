import { useKeycloak } from "@react-keycloak/web";
import { Profile } from "App/types";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const { keycloak } = useKeycloak();
  const [profile, setProfile] = useState<undefined | Profile>();
  useEffect(() => {
    const load = async () => {
      if (keycloak.authenticated) {
        const info: any = await keycloak.loadUserInfo();
        setProfile({
          familyName: info.family_name,
          givenName: info.given_name,
          username: info.preferred_username,
        });
      }
    };
    load();
  }, [keycloak]);
  return profile;
};
