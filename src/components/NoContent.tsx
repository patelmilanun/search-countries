interface Props {
  init: boolean;
  isLoading: boolean;
}

const NoContent = ({ init, isLoading }: Props) => {
  return (
    <div className="text-center">
      {isLoading ? 'Loading...' : init ? 'Not found' : 'Start searching'}
    </div>
  );
};

export default NoContent;
