import React, { FC } from "react";
import styled from "styled-components";
import { Box, List } from "zmp-ui";
import tw from "twin.macro";
import { OAItemSkeleton } from "@components/skeleton";
import { useStore } from "@store";
import OAItem from "./OAItem";

// =================== styled ===================
const ListWrapper = styled(Box)`
  ${tw`bg-transparent w-full`};
  padding: 0 !important; /* ✅ loại bỏ padding mặc định */
  margin: 0 !important;
`;

const ListOAStyled = styled(List)`
  padding: 0 !important; /* ✅ bỏ padding mặc định ZMP List */
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
`;

// =================== component ===================
const ListOA: FC<any> = () => {
  const { officialAccounts } = useStore((state) => state.organization) || {
    officialAccounts: [],
  };
  const loading = useStore((state) => state.gettingOrganization);

  return (
    <ListWrapper>
      <ListOAStyled>
        {!loading &&
          officialAccounts?.map((item) => (
            <OAItem key={item.oaId} officialAccount={item} />
          ))}

        {loading && <OAItemSkeleton />}
      </ListOAStyled>
    </ListWrapper>
  );
};

export default ListOA;
