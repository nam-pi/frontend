import { useKeycloak } from "@react-keycloak/web";
import { API_ENTRYPOINT, HYDRA_CLIENT } from "App/constants";
import { schemaOrg } from "App/namespaces";
import { Profile } from "App/types";
import { buildPath } from "App/utils/buildPath";
import { extractItem } from "App/utils/extractItem";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const { keycloak } = useKeycloak();
  const [profile, setProfile] = useState<undefined | Profile>();
  useEffect(() => {
    const load = async () => {
      const data = await HYDRA_CLIENT.getResource(
        buildPath(API_ENTRYPOINT, "user")
      );
      const item = (await extractItem(data)) as any;
      const authorUrl = item[schemaOrg.sameAs][0]["@id"];
      const email = item[schemaOrg.email][0]["@value"];
      const familyName = item[schemaOrg.familyName][0]["@value"];
      const givenName = item[schemaOrg.givenName][0]["@value"];
      const username = item[schemaOrg.name][0]["@value"];
      setProfile({ authorUrl, email, familyName, givenName, username });
    };
    load();
  }, [keycloak]);
  return profile;
};
