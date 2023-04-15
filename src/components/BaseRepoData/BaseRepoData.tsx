import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const BaseRepoData = () => {
  const { repoURL, name, stars, statusRepo } = useSelector(
    (state: RootState) => state.repo
  );

  return (
    <>
      {statusRepo === "error" && <div>Репозиторий отсутствует</div>}
      {statusRepo === "success" && (
        <div>
          <a href={repoURL}>{name}</a>
          <p>{stars}</p>
        </div>
      )}
    </>
  );
};
