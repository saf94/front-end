import React, { Fragment, useRef } from 'react';
import { bool, string } from 'prop-types';
import useIsIntersecting from './useIsIntersecting';

Image.propTypes = {
  alt: string.isRequired,
  height: string,
  isLazyLoaded: bool,
  sizes: string,
  src: string.isRequired,
  srcSet: string,
  width: string,
};

Image.defaultProps = {
  height: '',
  isLazyLoaded: true,
  sizes: '',
  srcSet: '',
  width: '',
};

function Image({ alt, height, isLazyLoaded, sizes, src, srcSet, width, ...rest }) {
  const ImageWhenJavaScriptDisabled = () => (
    <noscript>
      <img
        alt={alt}
        height={height}
        sizes={sizes}
        src={src}
        srcSet={srcSet}
        width={width}
        {...rest}
      />
    </noscript>
  );

  if (!isLazyLoaded) {
    return <ImageWhenJavaScriptDisabled />;
  }

  const imageElementReference = useRef(null);

  const isIntersecting = useIsIntersecting(imageElementReference, {
    shouldObserveOnce: true,
  });

  console.log('isIntersecting', isIntersecting);

  const sourceProperties = isIntersecting
    ? {
        'data-src': undefined,
        src,
      }
    : {
        'data-src': src,
        src: undefined,
      };

  return (
    <Fragment>
      <ImageWhenJavaScriptDisabled />

      <img
        alt={alt}
        height={height}
        sizes={sizes}
        srcSet={srcSet}
        width={width}
        {...rest}
        // listing sourceProperties after ...rest means that src and data-src can't be overriden
        {...sourceProperties}
      />
    </Fragment>
  );
}

export default Image;
