export default function AlbumsList({ albums, handleAlbumClick, disabled }) {
  return (
    <div className='albums-list'>
      {albums.map((album) =>
        album.master_id ? (
          <div
            key={album.id}
            className={disabled ? 'album-cover-isdisabled' : ''}
            >
            <img
              onClick={() => handleAlbumClick(album)}
              src={album.cover_image}
              alt={album.title}
            />
          </div>
        ) : null
      )}
    </div>
  );
}
