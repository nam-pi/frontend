import { Author, useAuthors } from "nampi-use-api";
import { FormattedMessage, useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import { AuthorDetails } from "../AuthorDetails";
import { ItemListSidebar } from "../ItemListSidebar";
import { PlaceholderText } from "../PlaceholderText";
import { SidebarPage } from "../SidebarPage";

interface Params {
  idLocal: string;
}

export const AuthorsPage = () => {
  const { formatMessage } = useIntl();
  const { idLocal } = useParams<Params>();
  const fetchResult = useAuthors({
    query: { orderBy: "label" },
  });
  return (
    <SidebarPage
      sidebar={
        <ItemListSidebar<Author>
          linkBase="author"
          fetchResult={fetchResult}
          itemName={formatMessage({
            description: "Authors sidebar list item name",
            defaultMessage: "Authors",
          })}
        />
      }
      main={
        idLocal ? (
          <AuthorDetails idLocal={idLocal} />
        ) : (
          <PlaceholderText>
            <FormattedMessage
              description="No author selected placeholder"
              defaultMessage="Please select an author"
            />
          </PlaceholderText>
        )
      }
    />
  );
};
