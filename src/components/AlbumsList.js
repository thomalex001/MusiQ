export default function AlbumsList({albums, handleAlbumClick}) {
  
  return (
    <div className='albums-list'>
      {albums.map((album) =>
        album.master_id ? (
          <div key={album.id}>
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
