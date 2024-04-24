import { PAGE_SIZE } from '../const';

interface Props {
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

const pagination = ({ offset, setOffset, pages, hasNext, hasPrev }: Props) => {
  return (
    <div className="py-1 px-4">
      <nav className="flex justify-end items-center space-x-1">
        <button
          type="button"
          disabled={hasPrev}
          className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => setOffset(offset - PAGE_SIZE)}
        >
          <span aria-hidden="true">«</span>
          <span className="sr-only">Previous</span>
        </button>
        {[...Array(pages)].map((_, index) => (
          <button
            key={index}
            type="button"
            className={`min-w-[40px] flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2.5 text-sm rounded-full disabled:opacity-50 disabled:pointer-events-none ${
              index === offset / PAGE_SIZE ? 'font-bold' : ''
            }`}
            aria-current="page"
            onClick={() => setOffset(index * PAGE_SIZE)}
          >
            {index + 1}
          </button>
        ))}

        <button
          type="button"
          disabled={hasNext}
          className="p-2.5 min-w-[40px] inline-flex justify-center items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
          onClick={() => setOffset(offset + PAGE_SIZE)}
        >
          <span className="sr-only">Next</span>
          <span aria-hidden="true">»</span>
        </button>
      </nav>
    </div>
  );
};

export default pagination;
